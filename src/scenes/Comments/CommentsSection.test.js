import React from "react";
import CommentsSection from "./CommentsSection";
import { render } from "../../test-utils";
import * as amplify from "aws-amplify";
import { screen, waitFor } from "@testing-library/react";
import { commentVisibility } from "../../apiConsts";

jest.mock("aws-amplify");

jest.mock("../../redux/Selectors", () => ({
    dataStoreReadyStatusSelector: () => true,
    getWhoami: () => ({ id: "whoami", displayName: "Test User" }),
}));

const mockComments = [
    {
        id: 1,
        body: "This is a comment",
        visibility: commentVisibility.everyone,
        createdAt: "2020-01-01T00:00:00.000Z",
        author: {
            id: 1,
            displayName: "Mock User",
            profilePictureThumbnailURL: "",
        },
    },
];

describe("CommentsSection", () => {
    it("should render correctly", async () => {
        amplify.DataStore.query.mockResolvedValue([]);
        const unsubscribe = jest.fn();
        amplify.DataStore.observe.mockReturnValue({
            subscribe: () => ({ unsubscribe }),
        });
        render(<CommentsSection />);
        await waitFor(async () => {
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(1);
        });
    });
    it("should render with comments", async () => {
        amplify.DataStore.query.mockResolvedValue(mockComments);
        const unsubscribe = jest.fn();
        amplify.DataStore.observe.mockReturnValue({
            subscribe: () => ({ unsubscribe }),
        });
        render(<CommentsSection parentId="test" />);
        await waitFor(async () => {
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(1);
        });
        expect(screen.getByText("This is a comment")).toBeInTheDocument();
        expect(screen.getByText("Mock User")).toBeInTheDocument();
    });
});
