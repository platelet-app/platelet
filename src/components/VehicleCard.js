import {StyledSharpCard} from "../css/common";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import CardItem from "./CardItem";
import React from "react";

export default function VehicleCard(props) {
    return (
        <div>
            <div key={props.vehicle.uuid}>
                <StyledSharpCard style={{height: "170px"}}>
                    <CardContent>
                        <Grid containerspacing={1} direction={"column"}>
                            <CardItem label={"Name"}>{props.vehicle.name ? props.vehicle.name : ""}</CardItem>
                            <CardItem
                                label={"Manufacturer"}>{props.vehicle.manufacturer ? props.vehicle.manufacturer : ""}</CardItem>
                            <CardItem
                                label={"Registration"}>{props.vehicle.registration_number ? props.vehicle.registration_number : ""}</CardItem>
                            <CardItem
                                label={"Assignee"}>{props.vehicle.assigned_user ? props.vehicle.assigned_user.display_name : ""}</CardItem>
                        </Grid>
                    </CardContent>
                </StyledSharpCard>
            </div>
        </div>
    )
}


