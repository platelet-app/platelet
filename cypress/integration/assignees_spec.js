describe("assigning users to tasks", () => {
    beforeEach(() => {
        cy.loginByCognitoApi(Cypress.env("username"), Cypress.env("password"));
    });

    it("assigns and unassigns a rider to a task", () => {
        cy.visit("/");
        cy.addSingleTask();
        cy.get("[data-cy=tasks-kanban-column-NEW]").children().first().click();
        cy.get("[data-cy=combo-box-riders]").click().type("Test Rider");
        cy.get('[id*="option-0"]').should("exist");
        cy.get('[id*="option-0"]').click();
        cy.get("[data-cy=task-status]").should("have.text", "ACTIVE");
        cy.get("[data-cy=task-RIDER-assignees]").contains("Test Rider");
        cy.get("[data-cy=task-status-close]").click();
        cy.get("[data-cy=tasks-kanban-column-ACTIVE]")
            .children()
            .its("length")
            .should("eq", 1);
        cy.get("[data-cy=tasks-kanban-column-ACTIVE]")
            .children()
            .first()
            .click();
        cy.get("[data-cy=edit-task-assignees]").click();
        cy.get(
            "[data-cy=task-RIDER-assignees] > :nth-child(3) > .MuiButtonBase-root > [data-testid=CancelIcon]"
        ).click();
        cy.get("[data-cy=task-RIDER-assignees]").should(
            "not.contain",
            "Test Rider"
        );
    });

    it("assigns and unassigns a coordinator to a task", () => {
        cy.visit("/");
        cy.addSingleTask();
        cy.get("[data-cy=tasks-kanban-column-NEW]").children().first().click();
        cy.findByText("COORDINATOR").click();
        cy.get("[data-cy=combo-box-coordinators]")
            .click()
            .type("Test Coordinator");
        cy.get('[id*="option-0"]').should("exist");
        cy.get('[id*="option-0"]').click();
        cy.get("[data-cy=task-COORDINATOR-assignees]").contains(
            "Test Coordinator"
        );
        cy.get("[data-cy=task-COORDINATOR-assignees]")
            .findAllByTestId("CancelIcon")
            .then((els) => {
                cy.wrap(els[1]).click();
            });
        cy.get("[data-cy=task-COORDINATOR-assignees]").should(
            "not.contain",
            "Test Coordinator"
        );
    });
});
