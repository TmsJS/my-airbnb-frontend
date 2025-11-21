import { useState, useMemo } from "react";
import { TextField, Button, Tooltip, Box } from "@mui/material";
import axios from "axios";

function ReviewsSection({ listing, onRatingClick }) {
  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email");

  const [score, setScore] = useState("");
  const [comment, setComment] = useState("");

  // ⭐ CALCULATE THE BREAKDOWN ⭐
  const breakdown = useMemo(() => {
    const map = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    listing.reviews.forEach((r) => {
      map[r.score] = (map[r.score] || 0) + 1;
    });
    return map;
  }, [listing]);

  const totalReviews = listing.reviews.length;

  // Tooltip content
  const tooltipContent = (
    <Box>
      {[5, 4, 3, 2, 1].map((star) => {
        const count = breakdown[star];
        const percent = totalReviews === 0
          ? 0
          : ((count / totalReviews) * 100).toFixed(1);
        return (
          <div key={star}>
            ⭐ {star}: {count} reviews ({percent}%)
          </div>
        );
      })}
    </Box>
  );

  const submit = async () => {
    await axios.post(
      `http://localhost:5005/listings/${listing.id}/review`,
      { review: { score: Number(score), comment } },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    window.location.reload();
  };

  return (
    <div style={{ marginTop: 40 }}>
      <h2>Reviews</h2>

      
      {/* ⭐ STAR RATING WITH TOOLTIP     */}
            <Tooltip title={tooltipContent} placement="right" arrow>
        <div style={{ fontSize: 20, cursor: "default", marginBottom: 10 }}>
          ⭐ Average Rating:{" "}
          {totalReviews === 0
            ? "No reviews"
            : (
                listing.reviews.reduce((s, r) => s + r.score, 0) /
                listing.reviews.length
              ).toFixed(1)}
        </div>
      </Tooltip>

      {/* ⭐ Review List + Click Handler */}
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

      {/* ⭐ Review Submission           */}
      {token && (
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
      )}
    </div>
  );
}

export default ReviewsSection;
