import React from "react";
import useTenantListGraphQL from "../../../hooks/useTenantListGraphQL";
import { TenantCard } from "./TenantCard";
import saveAmplifyConfig from "../../../utilities/saveAmplifyConfig";
import _ from "lodash";
import configureAmplify from "../utilities/configureAmplify";
import { ScrollView, useColorScheme, View } from "react-native";
import { Divider, Text, useTheme } from "react-native-paper";
import ContentLoader, { Rect } from "react-content-loader/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type TenantListProps = {
    onComplete: () => void;
};

const Wrapper = ({ children }: { children: React.ReactNode }) => {
    const colorScheme = useColorScheme();
    const insets = useSafeAreaInsets();
    return (
        <ScrollView
            style={{
                backgroundColor: colorScheme === "dark" ? "#000" : "#fff",
                paddingTop: insets.top,
                paddingBottom: insets.bottom,
                paddingHorizontal: 8,
            }}
        >
            <Text variant="headlineMedium">Please choose your team</Text>
            <Divider />
            {children}
        </ScrollView>
    );
};

export const TenantList: React.FC<TenantListProps> = ({ onComplete }) => {
    const { state, error, isFetching } = useTenantListGraphQL();
    const [isProcessing, setIsProcessing] = React.useState(false);
    const { colors } = useTheme();

    const onClickTenant = async (tenantId: string) => {
        setIsProcessing(true);
        try {
            await AsyncStorage.setItem("tenantId", tenantId);
            const config = await saveAmplifyConfig(tenantId);
            configureAmplify(config);
            onComplete();
        } catch (error) {
            console.log("Get tenant graphql error:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    if (error) {
        return (
            <Wrapper>
                <Text>
                    There was an error while retrieving the available teams.
                </Text>
            </Wrapper>
        );
    } else if (isFetching) {
        return (
            <Wrapper>
                <ContentLoader
                    testID="tenant-list-skeleton"
                    speed={2}
                    width="100%"
                    height={800}
                    viewBox="0 0 400 800"
                    backgroundColor={colors.shimmerBackground}
                    foregroundColor={colors.shimmerForeground}
                >
                    {_.range(0, 15).map((i) => {
                        const result = (
                            <Rect
                                key={`skeleton_${i}`}
                                x="0"
                                y={i * 50}
                                rx="4"
                                ry="4"
                                width="100%"
                                height="40"
                            />
                        );
                        return result;
                    })}
                </ContentLoader>
            </Wrapper>
        );
    } else {
        return (
            <Wrapper>
                {state
                    .sort(
                        // sort alphabetically by name
                        (a, b) => a.name.localeCompare(b.name)
                    )
                    .map((tenant) => (
                        <TenantCard
                            disabled={isProcessing}
                            onPress={() => onClickTenant(tenant.id)}
                            key={tenant.id}
                            name={tenant.name}
                        />
                    ))}
            </Wrapper>
        );
    }
};

export default TenantList;
