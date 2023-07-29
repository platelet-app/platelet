import { Card, useTheme } from "react-native-paper";
import * as React from "react";
import useModelSubscription from "../../../hooks/useModelSubscription";
import * as models from "../../../models";
import LabelItemPair from "./LabelItemPair";
import moment from "moment";
import GenericError from "../../Errors/GenericError";
import ContentLoader, { Rect } from "react-content-loader/native";

type TaskDetailsProps = {
    taskId: string;
};

const isToday = (time: string | undefined | null) => {
    if (!time) {
        return false;
    }
    const today = new Date();
    const date = new Date(time);
    return (
        today.getDate() === date.getDate() &&
        today.getMonth() === date.getMonth() &&
        today.getFullYear() === date.getFullYear()
    );
};

const CardWrapper = ({ children }: { children: React.ReactNode }) => {
    return (
        <Card>
            <Card.Content>{children}</Card.Content>
        </Card>
    );
};

const TaskDetails: React.FC<TaskDetailsProps> = ({ taskId }) => {
    const { state, isFetching, error } = useModelSubscription<models.Task>(
        models.Task,
        taskId
    );
    const { colors } = useTheme();

    let calendarTime = "";
    const momentFormat = "DD/MM/YYYY, HH:mm";

    if (state?.timeOfCall && isToday(state?.timeOfCall)) {
        calendarTime = `Today at ${moment(state?.timeOfCall).format("HH:mm")}`;
    } else if (state?.timeOfCall) {
        calendarTime = moment(state?.timeOfCall).format(momentFormat);
    }

    if (error) {
        return (
            <CardWrapper>
                <GenericError />
            </CardWrapper>
        );
    } else if (isFetching) {
        return (
            <CardWrapper>
                <ContentLoader
                    testID="task-details-skeleton"
                    speed={2}
                    width="100%"
                    height={60}
                    viewBox="0 0 400 60"
                    backgroundColor={colors.shimmerBackground}
                    foregroundColor={colors.shimmerForeground}
                >
                    <Rect x="0" y="0" rx="0" ry="0" width="400" height="20" />
                    <Rect x="0" y="22" rx="0" ry="0" width="400" height="20" />
                    <Rect x="0" y="44" rx="0" ry="0" width="400" height="20" />
                </ContentLoader>
            </CardWrapper>
        );
    } else {
        return (
            <CardWrapper>
                {state?.timeOfCall && (
                    <LabelItemPair
                        showUnset
                        label="Time of call"
                        item={calendarTime || ""}
                    />
                )}
                <LabelItemPair
                    showUnset
                    label="Priority"
                    item={state?.priority || ""}
                />
                <LabelItemPair
                    showUnset
                    label="Rider role"
                    item={state?.riderResponsibility || ""}
                />
            </CardWrapper>
        );
    }
};

export default TaskDetails;
