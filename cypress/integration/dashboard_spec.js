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
        cy.clearLocalStorageSnapshot();
        cy.clearLocalStorage();
        cy.clearTasks();
    });

    beforeEach(() => {
        cy.restoreLocalStorage();
    });

    afterEach(() => {
        cy.saveLocalStorage();
    });

    it("successfully creates a new task", () => {
        cy.visit("/");
        cy.get("#create-task-button").click();
        cy.get("#save-to-dash-button").click();
        cy.get("#tasks-kanban-column-NEW").children().should("have.length", 1);
    });
    it("opens a new task", () => {
        cy.visit("/");
        cy.get("#tasks-kanban-column-NEW").children().first().click();
        cy.url().should("include", "/task/");
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
        cy.populateTasks();
    });

    after(() => {
        cy.clearLocalStorageSnapshot();
        cy.clearLocalStorage();
        cy.clearTasks();
    });

    beforeEach(() => {
        cy.restoreLocalStorage();
    });

    afterEach(() => {
        cy.saveLocalStorage();
    });

    const filterCheck = ($el) => {
        if ($el.hasClass(".makeStyles-taskItem-26.makeStyles-show-4")) {
            cy.wrap($el).should("contain", "LOW");
        }
    };
    it.skip("successfully filters tasks by priority", () => {
        cy.visit("/");
        cy.get("#role-menu-button > [data-testid=ArrowDropDownIcon]").click();
        // click the first menu option
        cy.get(
            "#role-menu > .MuiPaper-root > .MuiList-root > :nth-child(1)"
        ).click();
        cy.get("#role-identifier").should("contain", "ALL");
        cy.get("#tasks-filter-input").type("LOW");
        // wait because of debounce
        cy.wait(400);
        for (const status of ["NEW", "ACTIVE", "PICKED_UP"]) {
            cy.get(`#tasks-kanban-column-${status}`)
                .children()
                .each(filterCheck);
        }
        cy.get("#dashboard-tab-1").click();
        for (const status of ["DROPPED_OFF", "CANCELLED", "REJECTED"]) {
            cy.get(`#tasks-kanban-column-${status}`)
                .children()
                .each(filterCheck);
        }
    });
    it("clears the filter term", () => {
        cy.visit("/");
        cy.get("#tasks-filter-input").type("LOW");
        cy.get("#clear-search-button").click();
        // tasks-filter-input should be empty
        cy.get("#tasks-filter-input").should("have.value", "");
    });
});
