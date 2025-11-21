import { render, screen, fireEvent } from "@testing-library/react";
import ReviewsSection from "../src/pages/Feature4/ReviewsSection";

test("shows No reviews yet when empty", () => {
  render(<ReviewsSection listing={{ reviews: [], id: 1 }} />);
  expect(screen.getByText("No reviews yet.")).toBeInTheDocument();
});

test("renders list of reviews", () => {
  const listing = { reviews: [{ score: 5, comment: "Great" }], id: 1 };
  render(<ReviewsSection listing={listing} />);
  expect(screen.getByText(/great/i)).toBeInTheDocument();
});
