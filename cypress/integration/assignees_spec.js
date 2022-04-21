describe.only("assigning users to tasks", () => {
    before(() => {
        cy.signIn();
        cy.clearTasks("ACTIVE");
    });

    after(() => {
        cy.clearLocalStorageSnapshot();
        cy.clearLocalStorage();
    });

    beforeEach(() => {
        cy.restoreLocalStorage();
    });

    afterEach(() => {
        cy.saveLocalStorage();
    });

    it("assigns and unassigns a rider to a task", () => {
        cy.visit("/");
        cy.addSingleTask();
        cy.get("[data-cy=tasks-kanban-column-NEW]").children().first().click();
        cy.get("[data-cy=combo-box-riders]").click().type("Test Rider");
        cy.get('[id*="option-0"]').should("exist");
        cy.get('[id*="option-0"]').click();
        cy.findAllByText("ACTIVE").should("exist");
        cy.get("[data-cy=task-RIDER-assignees]")
            .findAllByText("Test Rider")
            .should("exist");
        // I don't know why this causes cypress to freeze
        // cy.findAllByText("Task moved to ACTIVE").should("exist");
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
        cy.wait(500);
        cy.get(
            "[data-cy=task-RIDER-assignees] > :nth-child(3) > .MuiButtonBase-root > [data-testid=CancelIcon]"
        ).click();
        cy.get("[data-cy=task-RIDER-assignees]")
            .findAllByText("Test Rider")
            .should("not.exist");
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
        cy.get("[data-cy=task-COORDINATOR-assignees]")
            .findAllByText("Test Coordinator")
            .should("exist");
        cy.wait(500);
        cy.get(
            "[data-cy=task-COORDINATOR-assignees] > :nth-child(4) > .MuiButtonBase-root > [data-testid=CancelIcon]"
        ).click();
        cy.get("[data-cy=task-COORDINATOR-assignees]")
            .findAllByText("Test Coordinator")
            .should("not.exist");
    });
});
