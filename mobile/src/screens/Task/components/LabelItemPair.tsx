import { Text, View } from "react-native";

type LabelItemPairProps = {
    label: string;
    item: string | null;
};

const LabelItemPair: React.FC<LabelItemPairProps> = ({ label, item }) => {
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
                style={{
                    fontStyle: item ? "normal" : "italic",
                }}
            >
                {item || "Unset"}
            </Text>
        </View>
    );
};

export default LabelItemPair;
