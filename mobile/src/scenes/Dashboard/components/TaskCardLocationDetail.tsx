import { Location } from "../API";
import * as models from "../models";
import { Text, View } from "react-native";

type TaskHistoryCardLocationDetailProps = {
    location?: Location | models.Location | null;
    nullLocationText?: string;
};

const TaskHistoryCardLocationDetail: React.FC<
    TaskHistoryCardLocationDetailProps
> = ({ location, nullLocationText = "No address" }) => {
    let addressString = "";
    if (location) {
        const items = [
            location.ward,
            location.line1,
            location.line2,
            location.line3,
            location.town,
            location.postcode,
        ];
        const filtered = items.filter((item) => item && item !== null);
        addressString = filtered.join(", ");
    }
    return (
        <View>
            <Text
                style={{ fontStyle: addressString ? "normal" : "italic" }}
                numberOfLines={1}
            >
                {addressString || nullLocationText}
            </Text>
        </View>
    );
};

export default TaskHistoryCardLocationDetail;
