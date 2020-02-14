import React, {useEffect} from 'react';
import '../App.css';
import 'typeface-roboto'
import {StyledAddCircleOutline, StyledCard} from '../css/common';
import CardContent from '@material-ui/core/CardContent';
import {makeStyles} from '@material-ui/core/styles';
import {Typography} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import {Link} from "react-router-dom";
import {getAllVehicles} from "../redux/Actions";
import {encodeUUID} from "../utilities";
import { useDispatch, useSelector } from "react-redux";

const useStyles = makeStyles({
    card: {
        minWidth: 275,
    },
    title: {
        fontSize: 20,
    },
    pos: {
        marginBottom: 12,
    },
});


function VehicleCard(props) {
    const classes = useStyles();
    return (
        <div>
            <div key={props.vehicle.uuid}>
                <StyledCard>
                    <CardContent>
                        <Typography className={classes.title}>{props.vehicle.name}</Typography>
                        <Typography className={classes.title}>{props.vehicle.manufacturer} {props.vehicle.model}</Typography>
                        <Typography className={classes.title}>{props.vehicle.registration_number}</Typography>
                    </CardContent>
                </StyledCard>
            </div>
        </div>
    )
}


function VehicleList() {
    const dispatch = useDispatch();
    // TODO: Figure out loaded stuff
    const [loaded, setLoaded] = React.useState(true);
    function componentDidMount() {
        dispatch(getAllVehicles());
    }

    useEffect(componentDidMount, []);
    const vehicles = useSelector(state => state.vehicles);


    const circleAdd =
        <StyledAddCircleOutline
            onClick={() => {
                console.log("add vehicle here!")
                //this.props.onAddSessionClick(newSession)

            }
            }
        />;
    let addButton;
    if (loaded) {
        addButton = circleAdd
    } else {
        addButton = <></>
    }
    return (
        <div style={{marginLeft: 30, marginTop: 100, marginRight: 30, marginBottom: 100}}>
            <Grid container
                  spacing={3}
                  direction={"row"}
                  justify={"flex-start"}
                  alignItems={"center"}
            >
                <Grid item xs={10} sm={5} md={4} lg={3}>
                    {addButton}
                </Grid>
                {vehicles.map((vehicle) => (
                    <Grid item xs={10} sm={5} md={4} lg={3} key={vehicle.uuid}>
                        <Link to={"/vehicle/" + encodeUUID(vehicle.uuid)} style={{ textDecoration: 'none' }}>
                            <VehicleCard vehicle={vehicle}/>
                        </Link>
                    </Grid>
                ))
                }
            </Grid>

        </div>
    )
}

export default VehicleList
