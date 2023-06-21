import React from "react";
import useTenantListGraphQL from "../../hooks/useTenantListGraphQL";
import { Divider, Skeleton, Stack, Typography } from "@mui/material";
import { TenantCard } from "./components/TenantCard";
import { displayErrorNotification } from "../../redux/notifications/NotificationsActions";
import { useDispatch } from "react-redux";
import configureAmplify from "./utilities/configureAmplify";
import saveAmplifyConfig from "../../utilities/saveAmplifyConfig";
import _ from "lodash";
import { PaddedPaper } from "../../styles/common";

interface TenantListProps {
    onSetupComplete: () => void;
}

export const TenantList: React.FC<TenantListProps> = ({
    onSetupComplete,
}: TenantListProps) => {
    const dispatch = useDispatch();
    const configFromLocalStorage = localStorage.getItem("amplifyConfig");

    //function onChangeFilterTerm(e: ChangeEvent<HTMLInputElement>) {
    //    const { value } = e.target;
    //    if (!value) {
    //        setTenants(tenantsListRef.current);
    //    } else {
    //        const result = matchSorter(tenantsListRef.current, value, {
    //            keys: ["name"],
    //        });
    //        setTenants(result);
    //    }
    //}

    const { state, error, isFetching } = useTenantListGraphQL();

    const onClickTenant = async (tenantId: string) => {
        try {
            localStorage.setItem("tenantId", tenantId);
            const config = await saveAmplifyConfig(tenantId);
            configureAmplify(config);
            onSetupComplete();
        } catch (error) {
            console.log("Get tenant graphql error:", error);
            dispatch(displayErrorNotification("Sorry, something went wrong"));
        }
    };

    React.useEffect(() => {
        if (
            (!process.env.REACT_APP_OFFLINE_ONLY ||
                process.env.REACT_APP_OFFLINE_ONLY === "false") &&
            (!process.env.REACT_APP_DEMO_MODE ||
                process.env.REACT_APP_DEMO_MODE === "false") &&
            !process.env.REACT_APP_TENANT_GRAPHQL_ENDPOINT
        ) {
            const config = require("../../aws-exports");
            configureAmplify(config.default);
            onSetupComplete();
        } else if (configFromLocalStorage) {
            configureAmplify(JSON.parse(configFromLocalStorage));
            onSetupComplete();
        }
    }, [configFromLocalStorage, onSetupComplete]);

    if (
        !process.env.REACT_APP_TENANT_GRAPHQL_ENDPOINT ||
        configFromLocalStorage
    ) {
        return <></>;
    } else if (error) {
        return (
            <PaddedPaper>
                <Typography variant="h6">
                    There was an error while retrieving the available teams.
                </Typography>
            </PaddedPaper>
        );
    } else if (isFetching) {
        return (
            <PaddedPaper>
                <Stack spacing={1}>
                    <Typography variant="h5">
                        Please choose your team
                    </Typography>
                    <Divider />
                    {_.range(0, 10).map((i) => (
                        <Skeleton
                            variant="rectangular"
                            sx={{ height: 30, maxWidth: 600, borderRadius: 1 }}
                        />
                    ))}
                </Stack>
            </PaddedPaper>
        );
    } else {
        return (
            <PaddedPaper maxWidth={"800px"}>
                <Stack spacing={1}>
                    <Typography variant="h5">
                        Please choose your team
                    </Typography>
                    <Divider />
                    {state
                        .sort(
                            // sort alphabetically by name
                            (a, b) => a.name.localeCompare(b.name)
                        )
                        .map((tenant) => (
                            <TenantCard
                                onClick={() => onClickTenant(tenant.id)}
                                key={tenant.id}
                                name={tenant.name}
                            />
                        ))}
                </Stack>
            </PaddedPaper>
        );
    }
};

export default TenantList;
