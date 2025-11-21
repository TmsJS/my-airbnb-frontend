import { render, screen } from "@testing-library/react";
import RatingBreakdownModal from "../src/pages/Feature4/RatingBreakdownModal";

test("does not render when no rating", () => {
  const { container } = render(
    <RatingBreakdownModal open={true} rating={null} listing={{ reviews: [] }} />
  );
  expect(container.firstChild).toBeNull();
});

test("renders subset of reviews for selected rating", () => {
  const listing = { reviews: [
    { score: 5, comment: "Great" },
    { score: 4, comment: "Ok" }
  ]};

  render(
    <RatingBreakdownModal 
      open={true}
      rating={5}
      listing={listing}
    />
  );

  expect(screen.getByText(/great/i)).toBeInTheDocument();
});
