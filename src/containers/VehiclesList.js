import React, {useEffect} from 'react';
import '../App.css';
import 'typeface-roboto'
import {PaddedPaper} from '../css/common';
import {AddCircleButton} from '../components/Buttons';
import Grid from "@material-ui/core/Grid";
import {Link} from "react-router-dom";
import {addVehicle, getAllVehicles} from "../redux/vehicles/VehiclesActions";
import {encodeUUID} from "../utilities";
import {useDispatch, useSelector} from "react-redux";
import {createLoadingSelector} from "../redux/selectors";
import CardsGridSkeleton from "../loadingComponents/CardsGridSkeleton";
import {setMenuIndex} from "../redux/Actions";
import VehicleContextMenu from "../components/ContextMenus/VehicleContextMenu";
import VehicleCard from "../components/VehicleCard";


function VehicleList() {
    const dispatch = useDispatch();
    const loadingSelector = createLoadingSelector(["GET_VEHICLES"]);
    const isFetching = useSelector(state => loadingSelector(state));

    function componentDidMount() {
        dispatch(getAllVehicles());
    }

    useEffect(componentDidMount, []);
    useEffect(() => {
        dispatch(setMenuIndex(4))
    }, []);
    const vehicles = useSelector(state => state.vehicles.vehicles);


    const circleAdd =
        <AddCircleButton
            onClick={() => {
                dispatch(addVehicle({}))
            }
            }
        />;
    if (isFetching) {
        return (
            <CardsGridSkeleton/>
        )
    } else {
        return (
            <Grid container spacing={2} direction={"column"} justify={"flex-start"} alignItems={"flex-start"}>
                <Grid item>
                    {circleAdd}
                </Grid>
                <Grid item>
                    <PaddedPaper width={"800px"}>
                        <Grid container spacing={1} direction={"row"} justify={"flex-start"} alignItems={"center"}>
                            <Grid item>
                                <Grid container
                                      spacing={3}
                                      direction={"row"}
                                      justify={"flex-start"}
                                      alignItems={"center"}
                                >
                                    {vehicles.map((vehicle) => (
                                        <Grid item key={vehicle.uuid}>
                                            <div style={{cursor: 'context-menu', position: "relative"}}>
                                                <Link to={"/vehicle/" + encodeUUID(vehicle.uuid)}
                                                      style={{textDecoration: 'none'}}>
                                                    <VehicleCard vehicle={vehicle}/>
                                                </Link>
                                                <div style={{
                                                    cursor: 'context-menu',
                                                    position: "absolute",
                                                    bottom: 0,
                                                    right: 0,
                                                    zIndex: 1000
                                                }}>
                                                    <VehicleContextMenu vehicleUUID={vehicle.uuid}/>
                                                </div>
                                            </div>
                                        </Grid>
                                    ))
                                    }
                                </Grid>
                            </Grid>
                        </Grid>
                    </PaddedPaper>
                </Grid>
            </Grid>

        )
    }
}

export default VehicleList
