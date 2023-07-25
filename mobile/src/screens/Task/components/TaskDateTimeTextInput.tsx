import * as React from "react";
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
        <TextInput
            mode="outlined"
            value={value}
            editable={false}
            label={label}
            right={<TextInput.Icon icon="menu-down" />}
        />
    );
};

export default TaskDateTimeTextInput;
