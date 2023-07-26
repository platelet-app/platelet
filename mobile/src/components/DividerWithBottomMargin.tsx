import { Divider } from "react-native-paper";
import { View } from "react-native";

const DividerWithBottomMargin: React.FC = () => {
    return (
        <View style={{ width: "100%", alignItems: "center" }}>
            <Divider style={{ marginBottom: 8, width: "90%" }} />
        </View>
    );
};

export default DividerWithBottomMargin;
