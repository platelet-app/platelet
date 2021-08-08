import React from "react";
import {useSelector} from "react-redux";
import {createLoadingSelector} from "../redux/LoadingSelectors";
import CardsGridSkeleton from "../SharedLoadingSkeletons/CardsGridSkeleton";
import Grid from "@material-ui/core/Grid";
import LocationCard from "../components/LocationCard";
import {PaddedPaper} from "../styles/common";

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
            <PaddedPaper>
                <Grid container direction={"row"} spacing={3}>
                    {
                        Object.values(locations).map(loc => {
                            return (
                                <Grid item key={loc.uuid}>
                                    <LocationCard uuid={loc.uuid} name={loc.name}/>

                                </Grid>
                            )
                        })
                    }
                </Grid>
            </PaddedPaper>
        )
    }


}
