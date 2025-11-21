import { useState, useEffect } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";

function HostedListingsPage() {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    const res = await axios.get("http://localhost:5005/listings");
    const myEmail = localStorage.getItem("email");

    const mine = res.data.listings.filter((l) => l.owner === myEmail);

    const detailed = await Promise.all(
      mine.map(async (l) => {
        const detail = await axios.get(`http://localhost:5005/listings/${l.id}`);
        return { id: l.id, ...detail.data.listing };
      })
    );

    setListings(detailed);
  };

  // DELETE listing (2.2 requirement)
  const deleteListing = async (id) => {
    await axios.delete(`http://localhost:5005/listings/${id}`);
    loadListings();
  };

  // UNPUBLISH listing (Feature 5.1)
  const unpublishListing = async (id) => {
    try {
      await axios.put(
        `http://localhost:5005/listings/unpublish/${id}`,
        {},
        { 
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        }
      );
      loadListings();
    } catch (err) {
      alert("Failed to unpublish listing.");
    }
  };

  // calculate total beds
  const totalBeds = (bedrooms) =>
    bedrooms.reduce((sum, b) => sum + b.numBeds, 0);


  return (
    <div>
      <h1>Your Hosted Listings</h1>

      <Button component={Link} to="/hosted/create" variant="contained">
        Create New Listing
      </Button>

      <br /><br />

      {listings.map((list) => (
        <div
          key={list.id}
          style={{
            border: "1px solid #ccc",
            padding: 10,
            margin: 10,
            borderRadius: 8,
          }}
        >
          {/* Thumbnail */}
          {list.metadata.youtubeUrl ? (
            <iframe
              width="200"
              height="120"
              src={list.metadata.youtubeUrl}
              title="YouTube video"
            />
          ) : (
            <img src={list.thumbnail} width="200" />
          )}

          <h2>{list.title}</h2>

          <p><b>Property Type:</b> {list.metadata.propertyType}</p>
          <p><b>Total Beds:</b> {totalBeds(list.metadata.bedrooms)}</p>
          <p><b>Bathrooms:</b> {list.metadata.bathrooms}</p>
          <p><b>Price per night:</b> ${list.price}</p>
          <p><b>Total reviews:</b> {list.reviews.length}</p>

          {/* Rating */}
          <p>
            <b>Rating:</b>
            {list.reviews.length > 0
              ? "⭐".repeat(
                  Math.round(
                    list.reviews.reduce((a, r) => a + r.score, 0) /
                      list.reviews.length
                  )
                )
              : "No ratings"}
          </p>

          {/* Edit listing */}
          <Button
            component={Link}
            to={`/hosted/edit/${list.id}`}
            variant="outlined"
          >
            Edit
          </Button>

          {/* Delete listing */}
          <Button
            onClick={() => deleteListing(list.id)}
            variant="outlined"
            color="error"
            sx={{ ml: 1 }}
          >
            Delete
          </Button>

          {/* Publish listing */}
          <Button
            component={Link}
            to={`/hosted/publish/${list.id}`}
            variant="outlined"
            color="success"
            sx={{ ml: 1 }}
          >
            Publish
          </Button>

          {/* Unpublish listing (Feature 5.1) */}
          <Button
            onClick={() => unpublishListing(list.id)}
            variant="outlined"
            color="warning"
            sx={{ ml: 1 }}
          >
            Remove Listing
          </Button>

          {/* Feature 5.2 — Manage bookings */}
          <Button
            component={Link}
            to={`/hosted/manage/${list.id}`}
            variant="contained"
            color="primary"
            sx={{ ml: 1 }}
          >
            Manage Bookings
          </Button>
        </div>
      ))}
    </div>
  );
}

export default HostedListingsPage;
