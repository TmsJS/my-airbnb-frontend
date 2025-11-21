describe("Admin happy path", () => {
  it("full admin flow", () => {

    // 1. Register
    cy.visit("http://localhost:3000/register");
    cy.get("#reg-email").type("test111@example.com");
    cy.get("#reg-pass").type("123456");
    cy.get("#reg-submit").click();
    cy.wait(500);

    // 2. Create listing
    cy.get("#create-listing-btn").click();
    cy.get("#title").type("My Test House");
    cy.get("#address").type("101 Street");
    cy.get("#price").type("100");
    cy.get("#create-submit").click();
    cy.wait(500);

    // 3. Update title + thumbnail
    cy.contains("Edit").click();
    cy.get("#title").clear().type("Updated Title");
    cy.get("#thumbnail").clear().type("https://placehold.co/500");
    cy.get("#edit-submit").click();
    cy.wait(500);

    // 4. Publish listing
    cy.contains("Publish").click();
    cy.wait(500);

    // 5. Unpublish listing
    cy.contains("Remove Listing").click();
    cy.wait(500);

    // 6. Make booking
    cy.contains("Explore").click();
    cy.contains("Updated Title").click();
    cy.get("#start-date").type("2025-01-01");
    cy.get("#end-date").type("2025-01-05");
    cy.contains("Check Availability").click();
    cy.contains("Confirm Booking").click();
    cy.wait(500);

    // 7. Logout
    cy.contains("Logout").click();
    cy.wait(500);

    // 8. Login again
    cy.get("#login-email").type("test111@example.com");
    cy.get("#login-pass").type("123456");
    cy.get("#login-submit").click();
  });
});
