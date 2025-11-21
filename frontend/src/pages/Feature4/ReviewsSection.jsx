import { useState, useEffect } from "react";
import { TextField, Button, Alert } from "@mui/material";
import axios from "axios";

function ReviewsSection({ listing, onRatingClick, onReviewsUpdated }) {
  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email");

  const [score, setScore] = useState("");
  const [comment, setComment] = useState("");

  const [canReview, setCanReview] = useState(false);
  const [message, setMessage] = useState("");

    //  Check if user is eligible to review
    useEffect(() => {
    if (token) checkEligibility();
  }, [listing]);

  const checkEligibility = async () => {
    try {
      const res = await axios.get("http://localhost:5005/bookings", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const acceptedBookings = res.data.bookings.filter(
        (b) =>
          b.listingId === listing.id &&
          b.owner === email &&
          b.status === "accepted"
      );

      setCanReview(acceptedBookings.length > 0);
    } catch (err) {
      console.error("Failed to load bookings", err);
    }
  };

  
  // Submit review
    const submit = async () => {
    try {
      await axios.post(
        `http://localhost:5005/listings/${listing.id}/review`,
        {
          review: { score: Number(score), comment },
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage("Review posted successfully!");
      setScore("");
      setComment("");

      // Inform parent component (ListingDetailPage) to reload listing
      onReviewsUpdated();
    } catch (err) {
      setMessage("Failed to post review.");
    }
  };

  return (
    <div style={{ marginTop: 40 }}>
      <h2>Reviews</h2>

      {/* Existing reviews */}
      {listing.reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        <ul>
          {listing.reviews.map((r, i) => (
            <li key={i}>
              <span
                style={{ cursor: "pointer", color: "blue" }}
                onClick={() => onRatingClick(r.score)}
              >
                ⭐ {r.score}
              </span>{" "}
              — {r.comment}
            </li>
          ))}
        </ul>
      )}

      {/* Success/Error message */}
      {message && (
        <Alert severity="info" sx={{ mt: 2 }}>
          {message}
        </Alert>
      )}

      {/* Review form */}
      {token ? (
        canReview ? (
          <>
            <TextField
              label="Score (1–5)"
              type="number"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              sx={{ mt: 2 }}
            />
            <TextField
              label="Comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              sx={{ mt: 2 }}
            />

            <Button variant="contained" sx={{ mt: 2 }} onClick={submit}>
              Post Review
            </Button>
          </>
        ) : (
          <p style={{ color: "gray", marginTop: 15 }}>
            You can leave a review once one of your bookings for this listing is
            <strong> accepted</strong>.
          </p>
        )
      ) : (
        <p style={{ color: "gray", marginTop: 15 }}>
          Login to leave a review.
        </p>
      )}
    </div>
  );
}

export default ReviewsSection;
