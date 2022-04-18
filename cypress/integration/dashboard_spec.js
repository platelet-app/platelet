describe("open the dashboard", () => {
    before(() => {
        cy.clearDataStore();
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

    it("successfully loads", () => {
        cy.visit("/");
    });
    it("should have the correct title", () => {
        //TODO this may change
        cy.title().should("include", "platelet");
    });

    it("should display all the columns", () => {
        cy.get(":nth-child(1) > .makeStyles-column-61").should(
            "contain",
            "NEW"
        );
        cy.get(":nth-child(2) > .makeStyles-column-61").should(
            "contain",
            "ACTIVE"
        );
        cy.get(":nth-child(3) > .makeStyles-column-61").should(
            "contain",
            "PICKED UP"
        );
        cy.get(":nth-child(4) > .makeStyles-column-61").should(
            "contain",
            "DELIVERED"
        );
        cy.get("#dashboard-tab-1").click();
        cy.get(":nth-child(1) > .makeStyles-column-61").should(
            "contain",
            "COMPLETED"
        );
        cy.get(":nth-child(2) > .makeStyles-column-61").should(
            "contain",
            "CANCELLED"
        );
        cy.get(":nth-child(3) > .makeStyles-column-61").should(
            "contain",
            "ABANDONED"
        );
        cy.get(":nth-child(4) > .makeStyles-column-61").should(
            "contain",
            "REJECTED"
        );
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
        cy.clearTasks();
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
        let taskCount = 0;
        if (Cypress.$("#tasks-kanban-column-NEW").children().length !== 0) {
            cy.get("#tasks-kanban-column-NEW")
                .children()
                .then(($tasks) => {
                    taskCount = $tasks.length;
                });
        }
        cy.get("#create-task-button").click();
        cy.get("#save-to-dash-button").click();
        cy.get("#tasks-kanban-column-NEW")
            .children()
            .should("have.length", taskCount + 1);
    });
    it("opens a new task and closes it", () => {
        cy.visit("/");
        cy.get("#tasks-kanban-column-NEW").children().first().click();
        cy.url().should("include", "/task/");
        cy.get("#task-status-close").click();
        cy.url().should("not.include", "/task/");
        cy.get("#task-status-close").should("not.exist");
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
        cy.get("#role-menu-button > [data-testid=ArrowDropDownIcon]").click();
        // click the second menu option
        cy.get(
            "#role-menu > .MuiPaper-root > .MuiList-root > :nth-child(2)"
        ).click();
        cy.get("#role-identifier").should("contain", "COORDINATOR");
    });
    it("successfully changes the role view to RIDER", () => {
        cy.visit("/");
        cy.get("#role-menu-button > [data-testid=ArrowDropDownIcon]").click();
        // click the third menu option
        cy.get(
            "#role-menu > .MuiPaper-root > .MuiList-root > :nth-child(3)"
        ).click();
        cy.get("#role-identifier").should("contain", "RIDER");
        // assert that tasks-kanban-column-NEW is not present
        cy.get("#tasks-kanban-column-NEW").should("not.exist");
    });
    it("successfully changes the role view to ALL", () => {
        cy.visit("/");
        cy.get("#role-menu-button > [data-testid=ArrowDropDownIcon]").click();
        // click the first menu option
        cy.get(
            "#role-menu > .MuiPaper-root > .MuiList-root > :nth-child(1)"
        ).click();
        cy.get("#role-identifier").should("contain", "ALL");
    });
});

describe("filter tasks by various terms", () => {
    before(() => {
        cy.signIn();
    });

    after(() => {
        cy.clearTasks();
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
    it("successfully filters tasks by priority", () => {
        cy.visit("/");
        cy.populateTasks();

        cy.get("#role-menu-button > [data-testid=ArrowDropDownIcon]").click();
        // click the first menu option
        cy.get(
            "#role-menu > .MuiPaper-root > .MuiList-root > :nth-child(1)"
        ).click();
        cy.get("#role-identifier").should("contain", "ALL");
        cy.get("#tasks-filter-input").type("LOW");
        // wait because of debounce
        cy.wait(400);
        cy.get(`#tasks-kanban-column-NEW`)
            .children()
            .filter(":visible")
            .each(filterCheck);
    });
    it("clears the filter term", () => {
        cy.visit("/");
        cy.get("#tasks-filter-input").type("LOW");
        cy.get("#clear-search-button").click();
        // tasks-filter-input should be empty
        cy.get("#tasks-filter-input").should("have.value", "");
    });
});
