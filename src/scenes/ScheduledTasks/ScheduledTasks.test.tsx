import * as models from "../../models";
import { DataStore } from "aws-amplify";
import { render } from "../../test-utils";
import ScheduledTasks from "./ScheduledTasks";
import { screen, waitFor } from "@testing-library/react";
import React from "react";
import { useDispatch } from "react-redux";
import * as assActions from "../../redux/taskAssignees/taskAssigneesActions";
import * as commentActions from "../../redux/comments/commentsActions";
import * as taskDeliverablesActions from "../../redux/taskDeliverables/taskDeliverablesActions";

const tenantId = "tenantId";

const FakeDispatchComponent = () => {
    const dispatch = useDispatch();
    React.useEffect(() => {
        dispatch(assActions.initTaskAssignees());
        dispatch(commentActions.initComments());
        dispatch(taskDeliverablesActions.initTaskDeliverables());
    }, [dispatch]);
    return null;
};

describe("ScheduledTasks", () => {
    afterEach(async () => {
        jest.restoreAllMocks();
        const scheduledTasks = await DataStore.query(models.ScheduledTask);
        const locations = await DataStore.query(models.Location);
        const users = await DataStore.query(models.User);
        await Promise.all(
            [...scheduledTasks, ...locations, ...users].map((item) =>
                DataStore.delete(item)
            )
        );
    });
    test("show scheduled tasks", async () => {
        const whoami = await DataStore.save(
            new models.User({
                tenantId,
                displayName: "name",
                roles: [models.Role.USER],
                username: "username",
                cognitoId: "cognitoId",
            })
        );
        const preloadedState = {
            whoami: { user: whoami },
        };
        const mockLocation = await DataStore.save(
            new models.Location({
                name: "location",
                tenantId,
                ward: "ward",
                line1: "line1",
                line2: "line2",
                town: "city",
                postcode: "postcode",
                listed: 1,
            })
        );
        const mockLocation2 = await DataStore.save(
            new models.Location({
                name: "location2",
                tenantId,
                ward: "ward2",
                line1: "line12",
                line2: "line22",
                town: "city2",
                postcode: "postcode2",
                listed: 1,
            })
        );
        const mockLocation3 = await DataStore.save(
            new models.Location({
                name: "location",
                tenantId,
                ward: "ward3",
                line1: "line13",
                line2: "line23",
                town: "city3",
                postcode: "postcode3",
                listed: 1,
            })
        );
        const mockTask = await DataStore.save(
            new models.ScheduledTask({
                pickUpLocation: mockLocation,
                dropOffLocation: mockLocation2,
                priority: models.Priority.HIGH,
                cronExpression: "0 18 * * *",
                tenantId,
            })
        );
        const mockTask2 = await DataStore.save(
            new models.ScheduledTask({
                pickUpLocation: mockLocation3,
                priority: models.Priority.LOW,
                cronExpression: "0 18 * * *",
                tenantId,
            })
        );
        const mockDeliverableType = await DataStore.save(
            new models.DeliverableType({
                label: "label",
                defaultUnit: models.DeliverableUnit.ITEM,
                tenantId,
            })
        );
        await DataStore.save(
            new models.Deliverable({
                deliverableType: mockDeliverableType,
                count: 4,
                unit: models.DeliverableUnit.ITEM,
                scheduledTask: mockTask,
                tenantId,
            })
        );
        await DataStore.save(
            new models.Deliverable({
                deliverableType: mockDeliverableType,
                count: 2,
                unit: models.DeliverableUnit.BOX,
                scheduledTask: mockTask2,
                tenantId,
            })
        );
        render(
            <>
                <FakeDispatchComponent />
                <ScheduledTasks />
            </>
        );
        expect(
            screen.getByTestId("scheduled-tasks-skeleton")
        ).toBeInTheDocument();
        await waitFor(() => {
            expect(screen.queryByTestId("scheduled-tasks-skeleton")).toBeNull();
        });
        // not an admin so don't show add button
        expect(
            screen.queryByRole("button", { name: "Add scheduled task" })
        ).toBeNull();
        expect(screen.getByText("HIGH")).toBeInTheDocument();
        expect(screen.getByText("LOW")).toBeInTheDocument();
        expect(await screen.findByText("label x 4")).toBeInTheDocument();
        expect(await screen.findByText("label x 2")).toBeInTheDocument();
        [mockLocation, mockLocation2, mockLocation2].forEach((location) => {
            expect(
                screen.getByText(new RegExp(`\\b${location.ward}\\b`))
            ).toBeInTheDocument();
            expect(
                screen.getByText(new RegExp(`\\b${location.line1}\\b`))
            ).toBeInTheDocument();
            expect(
                screen.getByText(new RegExp(`\\b${location.line2}\\b`))
            ).toBeInTheDocument();
            expect(
                screen.getByText(new RegExp(`\\b${location.town}\\b`))
            ).toBeInTheDocument();
            expect(
                screen.getByText(new RegExp(`\\b${location.postcode}\\b`))
            ).toBeInTheDocument();
        });
    });
    test("don't show add button unless an admin", async () => {
        const whoami = await DataStore.save(
            new models.User({
                tenantId,
                displayName: "name",
                roles: [models.Role.ADMIN],
                username: "username",
                cognitoId: "cognitoId",
            })
        );
        const preloadedState = {
            whoami: { user: whoami },
        };
        render(
            <>
                <ScheduledTasks />
            </>,
            { preloadedState }
        );
        await waitFor(() => {
            expect(screen.queryByTestId("scheduled-tasks-skeleton")).toBeNull();
        });
        expect(
            screen.getByRole("button", { name: "Add scheduled task" })
        ).toBeInTheDocument();
    });
});
