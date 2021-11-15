describe("open the dashboard", () => {
    it("successfully loads", () => {
        cy.visit("/");
    });
});

describe("create a new task and open it", () => {
    it("successfully creates a new task", () => {
        cy.visit("/");
        cy.get("#create-task-button").click();
        cy.get("#tasks-kanban-column-NEW").children().should("have.length", 1);
    });
    it("opens a new task", () => {
        cy.visit("/");
        cy.get("#create-task-button").click();
        cy.get("#tasks-kanban-column-NEW").first().click();
    });
});
