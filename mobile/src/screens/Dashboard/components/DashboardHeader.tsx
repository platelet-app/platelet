import { useSelector } from "react-redux";
import * as React from "react";
import SearchAndUserMenuBar from "./SearchAndUserMenuBar";
import { Text } from "react-native-paper";
import { selectedItemsSelector } from "../../../redux/Selectors";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MultipleSelectionMenu from "./MultipleSelectionMenu";

type DashboardHeaderProps = {
    tabIndex: number;
};

const DashboardHeaderWrapper = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const insets = useSafeAreaInsets();
    return (
        <View
            style={{
                paddingLeft: insets.left + 16,
                paddingRight: insets.right + 16,
                paddingTop: insets.top,
            }}
        >
            {children}
        </View>
    );
};

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ tabIndex }) => {
    const selectedItems = useSelector(selectedItemsSelector);
    const dataIsSelected = selectedItems[tabIndex]
        ? Object.values(selectedItems[tabIndex]).length > 0
        : false;
    if (dataIsSelected) {
        return (
            <DashboardHeaderWrapper>
                <MultipleSelectionMenu tabIndex={tabIndex} />
            </DashboardHeaderWrapper>
        );
    } else {
        return (
            <DashboardHeaderWrapper>
                <SearchAndUserMenuBar />
            </DashboardHeaderWrapper>
        );
    }
};

export default DashboardHeader;
