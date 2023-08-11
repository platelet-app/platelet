import React from "react";
import { Text, TouchableRipple } from "react-native-paper";

interface TenantCardProps {
    name: string;
    onPress: () => void;
    disabled?: boolean;
}

export const TenantCard: React.FC<TenantCardProps> = ({
    name,
    onPress,
    disabled = false,
}: TenantCardProps) => {
    return (
        <TouchableRipple
            style={{
                borderRadius: 1,
                width: "100%",
                maxWidth: 500,
                marginTop: 8,
            }}
            onPress={onPress}
            disabled={disabled}
        >
            <Text variant="bodyLarge">{name}</Text>
        </TouchableRipple>
    );
};
