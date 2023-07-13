import React from "react";
import { Text } from "react-native";

type TaskHistoryTimestampProps = {
    timestamp: string;
};

const TaskHistoryTimestamp: React.FC<TaskHistoryTimestampProps> = ({
    timestamp,
}) => {
    return <Text>{timestamp}</Text>;
};

export default TaskHistoryTimestamp;
