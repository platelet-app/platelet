describe("open the dashboard", () => {
    beforeEach(() => {
        cy.loginByCognitoApi(Cypress.env("username"), Cypress.env("password"));
    });

    it("successfully loads", () => {
        cy.visit("/");
    });
    it("should have the correct title", () => {
        //TODO this may change
        cy.title().should("include", "platelet");
    });

    it("should display all the columns", () => {
        cy.get("[data-cy=NEW-header]").should("contain", "NEW");
        cy.get("[data-cy=ACTIVE-header]").should("contain", "ACTIVE");
        cy.get('[data-cy="PICKED UP-header"]').should("contain", "PICKED UP");
        cy.get("[data-cy=DELIVERED-header]").should("contain", "DELIVERED");
        cy.get("[data-cy=dashboard-tabpanel-1]").click();
        cy.get("[data-cy=COMPLETED-header]").should("contain", "COMPLETED");
        cy.get("[data-cy=CANCELLED-header]").should("contain", "CANCELLED");
        cy.get("[data-cy=ABANDONED-header]").should("contain", "ABANDONED");
        cy.get("[data-cy=REJECTED-header]").should("contain", "REJECTED");
    });
    it("should display the logged in user's initials", () => {
        cy.get(".MuiAvatar-root").should("contain", "TU");
    });
    it.skip("should display the logged in user's avatar", () => {
        cy.get("a > .MuiAvatar-root > .MuiAvatar-img").should(
            "have.attr",
            "src"
        );
    });
});

describe("create a new task and open it", () => {
    before(() => {
        cy.signIn();
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

    it("successfully creates a new task", () => {
        cy.visit("/");
        // get the length of the tasks before creating a new one
        cy.get("[data-cy=NEW-title-skeleton]").should("not.exist");
        cy.get(".MuiPaper-root").should("be.visible");
        cy.get("[data-cy=create-task-button]").click();
        cy.get("[data-cy=save-to-dash-button]").click();
        cy.get("[data-cy=tasks-kanban-column-NEW]")
            .children()
            .its("length")
            .should("be.gt", 0);
    });

    it("opens a new task and closes it", () => {
        cy.visit("/");
        cy.get("[data-cy=tasks-kanban-column-NEW]").children().first().click();
        cy.url().should("include", "/task/");
        cy.get("[data-cy=task-status-close]").click();
        cy.url().should("not.include", "/task/");
        cy.get("[data-cy=task-status-close]").should("not.exist");
    });
});

describe("change the role view of the dashboard", () => {
    before(() => {
        cy.signIn();
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

    it("successfully changes the role view to COORDINATOR", () => {
        cy.visit("/");
        cy.get("[data-cy=role-identifier]").should("not.contain", "NULL VIEW");
        cy.get("[data-cy=role-menu-button]").click();
        // click the second menu option
        cy.get(
            "[data-cy=role-menu] > .MuiPaper-root > .MuiList-root > :nth-child(2)"
        ).click();
        cy.get("[data-cy=role-identifier]").should("contain", "COORDINATOR");
        cy.get("[data-cy=tasks-kanban-column-NEW]").should("exist");
    });
    it("successfully changes the role view to RIDER", () => {
        cy.visit("/");
        cy.get("[data-cy=role-identifier]").should("not.contain", "NULL VIEW");
        cy.get("[data-cy=role-menu-button]").click();
        // click the third menu option
        cy.get(
            "[data-cy=role-menu] > .MuiPaper-root > .MuiList-root > :nth-child(3)"
        ).click();
        cy.get("[data-cy=role-identifier]").should("contain", "RIDER");
        // assert that tasks-kanban-column-NEW is not present
        cy.get("[data-cy=tasks-kanban-column-NEW]").should("not.exist");
    });
    it("successfully changes the role view to ALL", () => {
        cy.visit("/");
        cy.get("[data-cy=role-identifier]").should("not.contain", "NULL VIEW");
        cy.get("[data-cy=role-menu-button]").click();
        // click the first menu option
        cy.get(
            "[data-cy=role-menu] > .MuiPaper-root > .MuiList-root > :nth-child(1)"
        ).click();
        cy.get("[data-cy=role-identifier]").should("contain", "ALL");
        cy.get("[data-cy=tasks-kanban-column-NEW]").should("exist");
    });
});

describe("filter tasks by various terms", () => {
    before(() => {
        cy.signIn();
        cy.clearTasks("NEW");
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

    const filterCheck = ($el) => {
        // check if element contains LOW
        cy.get($el).contains("LOW");
    };
    it("successfully filters tasks by priority and clears the search term", () => {
        cy.visit("/");
        cy.populateTasks();
        cy.scrollTo("bottom", { duration: 4000 });
        cy.get("[data-cy=tasks-filter-input]").click().type("LOW");
        // wait because of debounce
        cy.wait(1000);
        cy.get(`[data-cy=tasks-kanban-column-NEW]`)
            .children()
            .filter(":visible")
            .each(filterCheck);
        cy.get("[data-cy=clear-search-button]").click();
        // tasks-filter-input should be empty
        cy.get("[data-cy=tasks-filter-input]").should("have.value", "");
    });
});
