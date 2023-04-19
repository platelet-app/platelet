import { aliasMutation } from "../utils/graphql-test-utils";

describe("open the dashboard", () => {
    beforeEach(() => {
        cy.signIn();
    });

    it("successfully loads", () => {
        cy.visit("/");
    });

    it("should display all the columns", () => {
        cy.get("[data-cy=NEW-header]").should("contain", "NEW");
        cy.get("[data-cy=ACTIVE-header]").should("contain", "ACTIVE");
        cy.get('[data-cy="PICKED UP-header"]').should("contain", "PICKED UP");
        cy.get("[data-cy=DELIVERED-header]").should("contain", "DELIVERED");
        cy.get("[data-testid=dashboard-tab-completed]").click();
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
        cy.signIn("COORDINATOR");
        cy.clearTasks("NEW");
        const endpoint = Cypress.env("appsyncGraphqlEndpoint");
        cy.intercept("POST", endpoint, (req) => {
            // Queries
            //aliasQuery(req, "GetLaunchList");

            // Mutations
            aliasMutation(req, "createTask");
            aliasMutation(req, "createTaskAssignee");
        });
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

    it("successfully creates a new task and opens it", () => {
        cy.visit("/");
        // get the length of the tasks before creating a new one
        cy.get("[data-cy=NEW-title-skeleton]").should("not.exist");
        cy.get(".MuiPaper-root").should("be.visible");
        cy.get("[data-cy=create-task-button]").click();
        cy.get("[data-cy=save-to-dash-button]").click();
        cy.get("[data-testid=tasks-kanban-column-NEW]")
            .children()
            .its("length")
            .should("be.gt", 0);
        cy.wait("@gqlcreateTaskMutation")
            .its("response.body.data.createTask")
            .should("not.be.null");
        cy.wait("@gqlcreateTaskAssigneeMutation")
            .its("response.body.data.createTaskAssignee")
            .should("not.be.null");
        cy.get("[data-testid=tasks-kanban-column-NEW]")
            .children()
            .first()
            .click();
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

    it("successfully changes the role view to RIDER", () => {
        cy.visit("/");
        cy.get("[data-testid=role-menu]").click();
        // click the second menu option
        cy.get('[data-value="RIDER"]').click();
        cy.get("[data-testid=role-menu]").should("contain", "RIDER");
        cy.get("[data-testid=tasks-kanban-column-NEW]").should("not.exist");
    });
    it("successfully changes the role view to ALL", () => {
        cy.visit("/");
        cy.get("[data-testid=role-menu]").click();
        // click the second menu option
        cy.get('[data-value="ALL"]').click();
        cy.get("[data-testid=role-menu]").should("contain", "ALL");
        cy.get("[data-testid=tasks-kanban-column-NEW]").should("exist");
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
        cy.get(`[data-testid=tasks-kanban-column-NEW]`)
            .children()
            .filter(":visible")
            .each(filterCheck);
        cy.get("[data-cy=clear-search-button]").click();
        // tasks-filter-input should be empty
        cy.get("[data-cy=tasks-filter-input]").should("have.value", "");
    });
});
