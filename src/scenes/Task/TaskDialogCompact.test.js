import React from "react";
import { render } from "../../test-utils";
import TaskDialogCompact from "./TaskDialogCompact";
import { screen, waitFor } from "@testing-library/react";
import * as amplify from "aws-amplify";

jest.mock("aws-amplify");

jest.mock("../../redux/Selectors", () => ({
    dataStoreReadyStatusSelector: () => true,
}));

const mockDispatch = jest.fn();
jest.mock("react-redux", () => ({
    ...jest.requireActual("react-redux"),
    useDispatch: () => mockDispatch,
}));
// describe("TaskDialogCompact", () => {
//     it("renders correctly", () => {
//         render(<TaskDialogCompact />);
//     });
//     it("displays not found message", async () => {
//         amplify.DataStore.query.mockResolvedValueOnce(null);
//         render(<TaskDialogCompact />);
//         await waitFor(() =>
//             expect(amplify.DataStore.query).toHaveBeenCalledTimes(4)
//         );
//         expect(screen.getByText("This page not found.")).toBeInTheDocument();
//         expect(screen.getByText(/Task with UUID/)).toBeInTheDocument();
//     });
//     it("displays the expected panels", () => {
//         render(<TaskDialogCompact taskId={"test"} />);
//     });
//});
