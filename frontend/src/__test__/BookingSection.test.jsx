import { render, screen, fireEvent } from "@testing-library/react";
import BookingSection from "../src/pages/Feature4/BookingSection";

test("renders Booking title", () => {
  render(<BookingSection listing={{ availability: [], id: 1, price: 100 }} />);
  expect(screen.getByText("Booking")).toBeInTheDocument();
});

test("updates start date", () => {
  render(<BookingSection listing={{ availability: [], id: 1, price: 100 }} />);
  const input = screen.getByLabelText(/start/i);
  fireEvent.change(input, { target: { value: "2025-01-01" }});
  expect(input.value).toBe("2025-01-01");
});
