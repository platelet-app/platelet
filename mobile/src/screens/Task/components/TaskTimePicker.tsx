import moment from "moment";
import { Text } from "react-native-paper";
import { View } from "react-native";
import * as models from "../../../models";

type TaskTimePickerProps = {
    time?: string | null;
    onChange: (value: Date) => void;
};

const TaskTimePicker: React.FC<TaskTimePickerProps> = ({
    time = null,
    onChange,
}) => {
    const timeString = moment(time).format("HH:mm");
    if (!time) {
        return null;
    } else {
        return (
            <View>
                <Text>{timeString}</Text>
            </View>
        );
    }
};

export default TaskTimePicker;
