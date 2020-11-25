import React from "react";
import {useSelector} from "react-redux";
import {createLoadingSelector} from "../redux/selectors";
import CardsGridSkeleton from "../SharedLoadingSkeletons/CardsGridSkeleton";
import Grid from "@material-ui/core/Grid";
import {Typography} from "@material-ui/core";

export default function LocationsList(props) {
    const loadingSelector = createLoadingSelector(['GET_AVAILABLE_LOCATIONS']);
    const isFetching = useSelector(state => loadingSelector(state));
    const locations = useSelector(state => state.availableLocations.locations)

    if (isFetching) {
        return (
            <CardsGridSkeleton/>

        )
    } else {
        return (
            <Grid container direction={"column"} spacing={1}>
            {
                locations.map(loc => {
                    return (
                    <Grid item>
                        <Typography>
                            {loc.name}
                        </Typography>
                    </Grid>
                )
                })
            }
            </Grid>
        )
    }


}
