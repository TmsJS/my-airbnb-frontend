# Testing Strategy

## 1. Component Testing (Jest + React Testing Library)

We implemented 3 component test files:

1. BookingSection.test.jsx
2. ReviewsSection.test.jsx
3. RatingBreakdownModal.test.jsx

Each component tests:
- Rendering
- Prop handling
- User interactions
- Edge cases
- Loading / empty states

We followed best practices:
- Shallow rendering
- No unnecessary mocking
- Clear test naming
- Logical ordering
- High coverage of normal & edge cases

## 2. UI Testing (Cypress)

We implemented one end-to-end test:

### Happy Path Test
This test automatically completes a full admin workflow:

1. Registers successfully  
2. Creates a listing  
3. Updates title + thumbnail  
4. Publishes listing  
5. Unpublishes listing  
6. Makes a booking  
7. Logs out  
8. Logs back in successfully  

This ensures all major flows of the application work as intended.

We used waits (`cy.wait`) to ensure backend responses finish before the next step.

## 3. Rationale (Solo)
Since this project is built around UI workflows and CRUD operations, we combined:
- Component tests for logic correctness
- UI tests for integration-level behaviour

Our tests provide confidence in:
- Component correctness
- Form behaviour
- State updates
- Backend integration correctness