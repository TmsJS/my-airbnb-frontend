import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  Divider,
  Alert,
  Paper,
} from "@mui/material";

export default function BookingManagementPage() {
  const { id } = useParams(); // listingId
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [listing, setListing] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");

  // SUMMARY METRICS
  const [totalDaysThisYear, setTotalDaysThisYear] = useState(0);
  const [totalProfitThisYear, setTotalProfitThisYear] = useState(0);

  useEffect(() => {
    loadListing();
    loadBookings();
  }, [id]);

  
  // Load listing info
  
  const loadListing = async () => {
    try {
      const res = await axios.get(`http://localhost:5005/listings/${id}`);
      setListing(res.data.listing);
    } catch (_err) {
      setError("Failed to fetch listing details");
    }
  };

  
  // Load ALL bookings (accepted, pending, denied)
  
  const loadBookings = async () => {
    try {
      const res = await axios.get("http://localhost:5005/bookings", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Filter by this listingId
      const mine = res.data.bookings.filter(
        (b) => String(b.listingId) === String(id)
      );

      setBookings(mine);
      computeSummary(mine);
    } catch (_err) {
      setError("Failed to fetch bookings");
    }
  };

  
  // Accept booking
  
  const acceptBooking = async (bookingId) => {
    try {
      await axios.put(
        `http://localhost:5005/bookings/accept/${bookingId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      loadBookings();
    } catch (_err) {
      alert("Failed to accept booking.");
    }
  };

  
  // Decline booking
  
  const declineBooking = async (bookingId) => {
    try {
      await axios.put(
        `http://localhost:5005/bookings/decline/${bookingId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      loadBookings();
    } catch (_err) {
      alert("Failed to decline booking.");
    }
  };

  
  // Compute summary: days booked this year + profit this year
  
  const computeSummary = (allBookings) => {
    const thisYear = new Date().getFullYear();

    let dayCount = 0;
    let profit = 0;

    for (const b of allBookings) {
      if (b.status !== "accepted") continue;

      const start = new Date(b.dateRange.start);
      const end = new Date(b.dateRange.end);

      if (start.getFullYear() === thisYear || end.getFullYear() === thisYear) {
        const nights =
          (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);

        dayCount += nights;
        profit += b.totalPrice;
      }
    }

    setTotalDaysThisYear(dayCount);
    setTotalProfitThisYear(profit);
  };

  
  // Helper: Calculate days online
  
  const calculateDaysOnline = (postedDate) => {
    const posted = new Date(postedDate);
    const now = new Date();
    const diff =
      (now.getTime() - posted.getTime()) / (1000 * 60 * 60 * 24);
    return Math.floor(diff);
  };

  
  // Render
  
  if (!listing) return <div>Loading listing...</div>;

  const pending = bookings.filter((b) => b.status === "pending");
  const history = bookings.filter((b) => b.status !== "pending");

  return (
    <Box p={3}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Booking Management – Listing #{id}
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      {/* Listing info */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6">{listing.title}</Typography>
        <Typography>Address: {listing.address}</Typography>
        <Typography>Type: {listing.metadata.propertyType}</Typography>
        <Typography>Bathrooms: {listing.metadata.bathrooms}</Typography>
        <Typography>
          Bedrooms: {listing.metadata.bedrooms.length} | Total Beds:{" "}
          {listing.metadata.bedrooms.reduce((s, b) => s + b.numBeds, 0)}
        </Typography>
        <Typography sx={{ mt: 1 }}>
          Posted {calculateDaysOnline(listing.postedOn)} days ago
        </Typography>
      </Paper>

      {/* Summary */}
      <Paper sx={{ p: 2, mb: 3, borderLeft: "5px solid green" }}>
        <Typography variant="h6">📊 This Year’s Summary</Typography>
        <Typography>Total Days Booked: {totalDaysThisYear}</Typography>
        <Typography>Total Profit: ${totalProfitThisYear}</Typography>
      </Paper>

      {/* Pending requests */}
      <Typography variant="h5" sx={{ mt: 2 }}>
        Pending Booking Requests
      </Typography>
      <Divider sx={{ mb: 2 }} />

      {pending.length === 0 ? (
        <Typography>No pending requests.</Typography>
      ) : (
        pending.map((b) => (
          <Paper
            key={b.id}
            sx={{ p: 2, mb: 2, borderLeft: "4px solid orange" }}
          >
            <Typography>
              <strong>Applicant:</strong> {b.owner}
            </Typography>
            <Typography>
              <strong>Dates:</strong> {b.dateRange.start} → {b.dateRange.end}
            </Typography>
            <Typography>
              <strong>Price:</strong> ${b.totalPrice}
            </Typography>

            <Button
              variant="contained"
              color="success"
              sx={{ mt: 1, mr: 1 }}
              onClick={() => acceptBooking(b.id)}
            >
              Accept
            </Button>
            <Button
              variant="outlined"
              color="error"
              sx={{ mt: 1 }}
              onClick={() => declineBooking(b.id)}
            >
              Decline
            </Button>
          </Paper>
        ))
      )}

      {/* History */}
      <Typography variant="h5" sx={{ mt: 4 }}>
        Booking History (Accepted / Denied)
      </Typography>
      <Divider sx={{ mb: 2 }} />

      {history.length === 0 ? (
        <Typography>No booking history.</Typography>
      ) : (
        history.map((b) => (
          <Paper
            key={b.id}
            sx={{
              p: 2,
              mb: 2,
              borderLeft:
                b.status === "accepted"
                  ? "4px solid green"
                  : "4px solid red",
            }}
          >
            <Typography>
              <strong>Applicant:</strong> {b.owner}
            </Typography>
            <Typography>
              <strong>Dates:</strong> {b.dateRange.start} →{" "}
              {b.dateRange.end}
            </Typography>
            <Typography>
              <strong>Price:</strong> ${b.totalPrice}
            </Typography>
            <Typography>
              <strong>Status:</strong> {b.status}
            </Typography>
          </Paper>
        ))
      )}

      <Button
        variant="contained"
        sx={{ mt: 3 }}
        onClick={() => navigate("/hosted")}
      >
        Back to Hosted Listings
      </Button>
    </Box>
  );
}
