import * as React from "react";
import { View } from "react-native";
import { TextInput } from "react-native-paper";

type TaskDateTimeTextInputProps = {
    label: string;
    value: string;
};

const TaskDateTimeTextInput: React.FC<TaskDateTimeTextInputProps> = ({
    label,
    value,
}) => {
    return (
        <View pointerEvents="none">
            <TextInput
                mode="outlined"
                value={value}
                editable={false}
                label={label}
                right={<TextInput.Icon icon="menu-down" />}
            />
        </View>
    );
};

export default TaskDateTimeTextInput;
