import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import BookingSection from "./BookingSection";
import ReviewsSection from "./ReviewsSection";
import RatingBreakdownModal from "./RatingBreakdownModal";

function ListingDetailPage() {
  const { id } = useParams();
  const location = useLocation();  
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);

  const [openModal, setOpenModal] = useState(false);
  const [selectedRating, setSelectedRating] = useState(null);

  const token = localStorage.getItem("token");
  const userEmail = localStorage.getItem("email");

  // From LandingPage: we pass dateStart + dateEnd through navigate
  const searchStart = location.state?.searchStart || null;
  const searchEnd = location.state?.searchEnd || null;

  const [userBookings, setUserBookings] = useState([]);

  useEffect(() => {
    loadListing();
    loadUserBookings();
  }, [id]);

  const loadListing = async () => {
    const res = await axios.get(`http://localhost:5005/listings/${id}`);
    setListing({ id, ...res.data.listing });
    setLoading(false);
  };

  const loadUserBookings = async () => {
    if (!token) return;

    const res = await axios.get("http://localhost:5005/bookings", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const my = res.data.bookings.filter(
      (b) => b.listingId === id && b.owner === userEmail
    );

    setUserBookings(my);
  };

  if (loading || !listing) return <h2>Loading…</h2>;

  // total beds
  const totalBeds = listing.metadata.bedrooms.reduce(
    (sum, b) => sum + b.numBeds,
    0
  );

  // avg rating
  const avgRating =
    listing.reviews.length === 0
      ? 0
      : (
        listing.reviews.reduce((s, r) => s + r.score, 0) /
          listing.reviews.length
      ).toFixed(1);

  // price display logic
  let priceDisplay = `Price: $${listing.price} per night`;

  if (searchStart && searchEnd) {
    const days =
      (new Date(searchEnd) - new Date(searchStart)) /
      (1000 * 60 * 60 * 24);

    if (days > 0) {
      priceDisplay = `Price: $${listing.price * days} per stay (${days} nights)`;
    }
  }

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: "0 auto" }}>
      <h1>{listing.title}</h1>

      {/* IMAGES (including thumbnail + metadata.images) */}
      <h3>Images</h3>
      <div style={{ display: "flex", gap: 10, overflowX: "auto" }}>
        <img
          src={listing.thumbnail}
          alt="thumbnail"
          width="250"
          style={{ borderRadius: 8 }}
        />

        {listing.metadata.images?.map((url, i) => (
          <img
            key={i}
            src={url}
            alt={`img-${i}`}
            width="250"
            style={{ borderRadius: 8 }}
          />
        ))}
      </div>

      <p><strong>Address:</strong> {listing.address}</p>
      <p><strong>Type:</strong> {listing.metadata.propertyType}</p>
      <p><strong>Bathrooms:</strong> {listing.metadata.bathrooms}</p>
      <p><strong>Bedrooms:</strong> {listing.metadata.bedrooms.length}</p>
      <p><strong>Total Beds:</strong> {totalBeds}</p>

      {/* PRICE */}
      <p><strong>{priceDisplay}</strong></p>

      {/* AMENITIES */}
      <h3>Amenities</h3>
      {listing.metadata.amenities?.length > 0 ? (
        <ul>
          {listing.metadata.amenities.map((a, i) => (
            <li key={i}>{a}</li>
          ))}
        </ul>
      ) : (
        <p>No amenities listed.</p>
      )}

      {/* USER BOOKINGS STATUS */}
      {token && (
        <>
          <h3>Your Bookings for This Listing</h3>
          {userBookings.length === 0 ? (
            <p>You have no bookings.</p>
          ) : (
            userBookings.map((b, i) => (
              <p key={i}>
                {b.dateRange.start} → {b.dateRange.end} — Status:{" "}
                <strong>{b.status}</strong>
              </p>
            ))
          )}
        </>
      )}

      {/* BOOKING SECTION */}
      <BookingSection listing={listing} />

      {/* REVIEWS */}
      <h3>Reviews</h3>
      <p><strong>Average Rating: {avgRating} ⭐</strong></p>

      <ReviewsSection
        listing={listing}
        onRatingClick={(rating) => {
          setSelectedRating(rating);
          setOpenModal(true);
        }}
      />

      <RatingBreakdownModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        listing={listing}
        rating={selectedRating}
      />
    </div>
  );
}

export default ListingDetailPage;
