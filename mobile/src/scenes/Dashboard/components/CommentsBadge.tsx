import { Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

type CommentsBadgeProps = {
    count: number;
    iconSize?: number;
};

const CommentsBadge: React.FC<CommentsBadgeProps> = ({
    count,
    iconSize = 18,
}) => {
    if (count > 0) {
        return (
            <View
                style={{
                    flexDirection: "row",
                }}
            >
                <MaterialIcons name="message" size={iconSize} color="black" />
                <Text>{count}</Text>
            </View>
        );
    } else {
        return null;
    }
};

export default CommentsBadge;
