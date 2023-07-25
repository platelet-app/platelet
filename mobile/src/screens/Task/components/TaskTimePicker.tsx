import moment from "moment";
import { IconButton, Text } from "react-native-paper";
import { View } from "react-native";

type TaskTimePickerProps = {
    time?: string | null;
    onClickEdit?: () => void;
    infoIcon?: boolean;
};

const TaskTimePicker: React.FC<TaskTimePickerProps> = ({
    time = null,
    onClickEdit,
    infoIcon = false,
}) => {
    const timeString = moment(time).format("HH:mm");
    if (!time) {
        return null;
    } else {
        return (
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-end",
                }}
            >
                <Text>{timeString}</Text>
                {infoIcon && (
                    <IconButton
                        style={{ marginLeft: 8, marginRight: 0 }}
                        icon="information-outline"
                        onPress={() => {
                            if (onClickEdit) {
                                onClickEdit();
                            }
                        }}
                    />
                )}
                <IconButton
                    style={{ marginLeft: infoIcon ? 0 : 8, marginRight: 0 }}
                    icon="pencil"
                    onPress={() => {
                        if (onClickEdit) {
                            onClickEdit();
                        }
                    }}
                />
            </View>
        );
    }
};

export default TaskTimePicker;
