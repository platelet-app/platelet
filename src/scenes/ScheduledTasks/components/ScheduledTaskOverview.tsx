import React from "react";
import * as models from "../../../models";
import { DataStore } from "aws-amplify";

type ScheduledTaskOverviewProps = {
    scheduledTaskId: string;
};

const ScheduledTaskOverview: React.FC<ScheduledTaskOverviewProps> = ({
    scheduledTaskId,
}) => {
    const [state, setState] = React.useState<models.ScheduledTask | null>(null);
    const [isFetching, setIsFetching] = React.useState(false);
    const [error, setError] = React.useState<Error | null>(null);
    const [notFound, setNotFound] = React.useState(false);
    const getScheduledTask = React.useCallback(async () => {
        try {
            setIsFetching(true);
            const result = await DataStore.query(
                models.ScheduledTask,
                scheduledTaskId
            );
            if (!result) {
                setNotFound(true);
            } else {
                setState(result);
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error);
            }
            console.log(error);
        } finally {
            setIsFetching(false);
        }
    }, [scheduledTaskId]);
    return null;
};

export default ScheduledTaskOverview;
