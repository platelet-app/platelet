import React from "react";
import useTenantListGraphQL from "../../../hooks/useTenantListGraphQL";
import { Divider, Skeleton, Stack, Typography } from "@mui/material";
import { TenantCard } from "./TenantCard";
import { displayErrorNotification } from "../../../redux/notifications/NotificationsActions";
import { useDispatch } from "react-redux";
import saveAmplifyConfig from "../../../utilities/saveAmplifyConfig";
import _ from "lodash";
import { PaddedPaper } from "../../../styles/common";
import configureAmplify from "../utilities/configureAmplify";

type TenantListProps = {
    onComplete: () => void;
};

export const TenantList: React.FC<TenantListProps> = ({ onComplete }) => {
    const dispatch = useDispatch();

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
    //

    const { state, error, isFetching } = useTenantListGraphQL();

    const onClickTenant = async (tenantId: string) => {
        try {
            localStorage.setItem("tenantId", tenantId);
            const config = await saveAmplifyConfig(tenantId, 300000);
            configureAmplify(config);
            onComplete();
        } catch (error) {
            console.log("Get tenant graphql error:", error);
            dispatch(displayErrorNotification("Sorry, something went wrong"));
        }
    };

    if (error) {
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
                            key={i}
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
