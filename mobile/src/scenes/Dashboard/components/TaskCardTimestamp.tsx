import React from "react";
import moment from "moment";
import { Text } from "react-native";

type TaskHistoryTimestampProps = {
    timestamp: string;
};

const TaskHistoryTimestamp: React.FC<TaskHistoryTimestampProps> = ({
    timestamp,
}) => {
    const calendar = moment(timestamp).calendar();
    return (
        <Text
            style={{
                fontStyle: "italic",
                fontSize: 12,
                maxWidth: "100%",
                color: "gray",
            }}
        >
            {calendar}
        </Text>
    );
};

export default TaskHistoryTimestamp;
