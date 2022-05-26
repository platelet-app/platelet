describe("task actions", () => {
    beforeEach(() => {
        cy.loginByCognitoApi(Cypress.env("username"), Cypress.env("password"));
    });

    it("picked up, delivered, rider home", () => {
        cy.visit("/");
        cy.addSingleTask();
        cy.get("[data-cy=tasks-kanban-column-NEW]").children().first().click();
        cy.get("[data-cy=combo-box-riders]").click().type("Test Rider");
        cy.get('[id*="option-0"]').should("exist");
        cy.get('[id*="option-0"]').click();
        cy.get("[data-cy=task-status]").should("have.text", "ACTIVE");
        cy.get("[data-cy=task-RIDER-assignees]").contains("Test Rider");
        cy.get("[data-cy=task-timePickedUp-button]").should("be.enabled");
        cy.get("[data-cy=task-timePickedUp-button]").click();
        cy.get("[data-cy=confirmation-ok-button]").click();
        //cy.findAllByText(`Today at ${timeNow}`).should("exist");
        cy.get("[data-cy=task-status]").should("have.text", "PICKED UP");
        cy.get("[data-cy=task-timeDroppedOff-button]").should("be.enabled");
        cy.get("[data-cy=task-timeDroppedOff-button]").click();
        cy.get("[data-cy=confirmation-ok-button]").click();
        cy.get("[data-cy=task-status]").should("have.text", "DELIVERED");
        cy.get("[data-cy=task-timeRiderHome-button]").should("be.enabled");
        cy.get("[data-cy=task-timeRiderHome-button]").click();
        cy.get("[data-cy=confirmation-ok-button]").click();
        cy.get("[data-cy=task-status]").should("have.text", "COMPLETED");
    });
});
