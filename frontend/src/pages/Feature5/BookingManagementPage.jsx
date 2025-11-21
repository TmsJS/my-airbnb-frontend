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
    } catch (err) {
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
    } catch (err) {
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
    } catch (err) {
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
    } catch (err) {
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


}
