import { Text } from "react-native-paper";
import { View } from "react-native";

type LabelItemPairProps = {
    label: string;
    item?: string | null;
    showUnset?: boolean;
};

const LabelItemPair: React.FC<LabelItemPairProps> = ({
    label,
    item,
    showUnset = false,
}) => {
    let text = item;
    if (!item && showUnset) {
        text = "Unset";
    }
    return (
        <View
            style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
            }}
        >
            <Text>{label}: </Text>
            <Text
                selectable
                style={{
                    fontStyle: item ? "normal" : "italic",
                }}
            >
                {text}
            </Text>
        </View>
    );
};

export default LabelItemPair;
