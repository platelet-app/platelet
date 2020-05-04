import React from "react";
import {StyledCard, StyledSharpCard, StyledStrip} from "../css/common";
import {Link} from "react-router-dom";
import {encodeUUID} from "../utilities";
import CardItem from "./CardItem";
import Grid from "@material-ui/core/Grid";

export default function UserCard(props) {
    return (
        <Link to={"/user/" + encodeUUID(props.user.uuid)}
            style={{textDecoration: 'none'}}>
            <StyledSharpCard style={{width: "300px", height: "120px"}}>
                <Grid container spacing={1} direction={"column"}>
                    <CardItem label={"Name"}>
                        {props.user.display_name}
                    </CardItem>
                    <CardItem label={"Patch"}>
                        {props.user.patch}
                    </CardItem>
                </Grid>
            </StyledSharpCard>
        </Link>
    )
}