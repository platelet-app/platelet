import { useColorScheme, View } from "react-native";
import { Text } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";

type CommentsBadgeProps = {
    count: number;
    iconSize?: number;
};

const CommentsBadge: React.FC<CommentsBadgeProps> = ({
    count,
    iconSize = 18,
}) => {
    const colorScheme = useColorScheme();
    if (count > 0) {
        return (
            <View
                style={{
                    flexDirection: "row",
                }}
            >
                <MaterialIcons
                    name="message"
                    size={iconSize}
                    color={colorScheme === "dark" ? "#ffffff" : "#000000"}
                />
                <Text>{count}</Text>
            </View>
        );
    } else {
        return null;
    }
};

export default CommentsBadge;
