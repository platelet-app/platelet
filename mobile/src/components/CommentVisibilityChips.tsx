import * as models from "../models";
import { View } from "react-native";
import { Chip, useTheme } from "react-native-paper";

type CommentVisibilityChipsProps = {
    value: models.CommentVisibility;
    onChange: (value: models.CommentVisibility) => void;
};

const CommentVisibilityChips: React.FC<CommentVisibilityChipsProps> = ({
    value,
    onChange,
}) => {
    const { colors } = useTheme();
    return (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            {Object.values(models.CommentVisibility).map((visibility) => (
                <Chip
                    mode="outlined"
                    key={visibility}
                    selected={visibility === value}
                    selectedColor={colors.primary}
                    onPress={() => onChange(visibility)}
                >
                    {visibility}
                </Chip>
            ))}
        </View>
    );
};

export default CommentVisibilityChips;
