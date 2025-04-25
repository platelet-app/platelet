import { renderHook } from "@testing-library/react-hooks";
import useIsPaidSubscription from "./useIsPaidSubscription";
import { Auth } from "aws-amplify";
import { waitFor } from "@testing-library/react";

describe("useIsPaidSubscription", () => {
    test("should return true when user is in PAID group", async () => {
        jest.spyOn(Auth, "currentSession").mockResolvedValue({
            getAccessToken: jest.fn(() => ({
                payload: {
                    "cognito:groups": ["PAID"],
                },
            })),
        } as any);
        const { result } = renderHook(() => useIsPaidSubscription());
        expect(result.current).toBe(false); // Initial state is false
        await waitFor(() => {
            expect(result.current).toBe(true);
        });
    });
    test("should return false when user is not in PAID group", async () => {
        const spy = jest.spyOn(Auth, "currentSession").mockResolvedValue({
            getAccessToken: jest.fn(() => ({
                payload: {
                    "cognito:groups": ["USER"],
                },
            })),
        } as any);
        const { result } = renderHook(() => useIsPaidSubscription());
        expect(result.current).toBe(false); // Initial state is false
        await waitFor(() => {
            expect(spy).toHaveBeenCalled();
        });
        await waitFor(() => {
            expect(result.current).toBe(false);
        });
    });
});
