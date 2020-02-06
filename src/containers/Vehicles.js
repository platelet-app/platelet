import React from 'react';
import '../App.css';
import 'typeface-roboto'
import {StyledAddCircleOutline, StyledCard} from '../css/common';
import CardContent from '@material-ui/core/CardContent';
import {makeStyles} from '@material-ui/core/styles';
import {Typography} from "@material-ui/core";
import {convertDate} from '../utilities'
import Grid from "@material-ui/core/Grid";
import update from 'immutability-helper';
import {Link} from "react-router-dom";
import Moment from "react-moment";
import {addSession} from "../redux/Actions";
import {connect} from "react-redux"
import {getAllVehicles} from "../redux/Actions";
import {encodeUUID} from "../utilities";
import { bindActionCreators } from "redux";

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
                        <Typography className={classes.title}>Vehicle {props.vehicle.name}</Typography>
                    </CardContent>
                </StyledCard>
            </div>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        vehicles: state.vehicles
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getVehiclesList: () => dispatch(getAllVehicles()),

    }
};

class VehList extends React.Component {
    componentDidMount() {
        this.props.getVehiclesList();
    }

    state = {
        vehicles: [],
        loaded: true
    };


    render() {
        const circleAdd =
            <StyledAddCircleOutline
                onClick={() => {
                    console.log("add vehicle here!")
                    //this.props.onAddSessionClick(newSession)

                }
                }
            />;
        let addButton;
        if (this.state.loaded) {
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
                    {this.props.vehicles.map((vehicle) => (
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
}

const VehicleList = connect(
    mapStateToProps,
    mapDispatchToProps
)(VehList);

export default VehicleList
