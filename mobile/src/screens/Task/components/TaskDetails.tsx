import { Text, View } from "react-native";
import { Card } from "react-native-paper";
import useModelSubscription from "../../../hooks/useModelSubscription";
import * as models from "../../../models";
import LabelItemPair from "./LabelItemPair";
import moment from "moment";

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

const TaskDetails: React.FC<TaskDetailsProps> = ({ taskId }) => {
    const { state, isFetching, error } = useModelSubscription<models.Task>(
        models.Task,
        taskId
    );
    let calendarTime = "";
    const momentFormat = "DD/MM/YYYY, HH:mm";

    if (state?.timeOfCall && isToday(state?.timeOfCall)) {
        calendarTime = `Today at ${moment(state?.timeOfCall).format("HH:mm")}`;
    } else if (state?.timeOfCall) {
        calendarTime = moment(state?.timeOfCall).format(momentFormat);
    }

    return (
        <Card>
            <Card.Content
                style={{
                    flexDirection: "column",
                    gap: 8,
                }}
            >
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
            </Card.Content>
        </Card>
    );
};

export default TaskDetails;
