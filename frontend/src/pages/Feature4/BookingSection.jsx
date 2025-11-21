import { useState, useEffect } from "react";
import axios from "axios";
import { TextField, Button, Alert } from "@mui/material";

function BookingSection({ listing }) {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [userBookings, setUserBookings] = useState([]);
  const [msg, setMsg] = useState("");

  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email");

  useEffect(() => {
    if (token) loadBookings();
  }, [listing]);

  const loadBookings = async () => {
    const res = await axios.get("http://localhost:5005/bookings", {
      headers: { Authorization: `Bearer ${token}` }
    });

    const my = res.data.bookings.filter(
      (b) => b.listingId === listing.id && b.owner === email
    );

    setUserBookings(my);
  };

  const check = () => {
    const ok = listing.availability.some(
      (r) => r.start <= start && r.end >= end
    );

    setMsg(ok ? "Available — press Confirm to book" : "Not Available");
  };

  const confirm = async () => {
    try {
      console.log("Sending booking request...");
      const res = await axios.post(
        `http://localhost:5005/bookings/new/${listing.id}`,
        {
          dateRange: { start, end },
          totalPrice:
            (new Date(end) - new Date(start)) / (1000*60*60*24) * listing.price
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      console.log("Booking success:", res.data);
      setMsg("Booking created!");
      loadBookings();

    } catch (err) {
      console.error("Booking error:", err.response?.data || err.message);
      setMsg("Booking failed: " + (err.response?.data?.error || err.message));
    }
  };


  return (
    <div style={{ marginTop: 30 }}>
      <h2>Booking</h2>

      {userBookings.map((b, i) => (
        <p key={i}>Booking {i+1}: {b.dateRange.start} → {b.dateRange.end} | Status: {b.status}</p>
      ))}

      <div style={{ display: "flex", gap: 20 }}>
        <TextField
          type="date"
          label="Start"
          InputLabelProps={{ shrink: true }}
          value={start}
          onChange={(e) => setStart(e.target.value)}
        />
        <TextField
          type="date"
          label="End"
          InputLabelProps={{ shrink: true }}
          value={end}
          onChange={(e) => setEnd(e.target.value)}
        />
      </div>

      <Button sx={{ mt: 1 }} variant="contained" onClick={check}>
        Check Availability
      </Button>

      {msg && (
        <Alert sx={{ mt: 1 }} severity="info">{msg}</Alert>
      )}

      {msg.includes("Available") && (
        <Button sx={{ mt: 1 }} variant="contained" color="success" onClick={confirm}>
          Confirm Booking
        </Button>
      )}
    </div>
  );
}

export default BookingSection;
