import {Link} from "react-router-dom";
import {encodeUUID} from "../utilities";
import {StyledSharpCard} from "../css/common";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import CardItem from "./CardItem";
import Moment from "react-moment";
import React from "react";

export default function SessionCard(props) {
    return (
        <Link to={"/session/" + encodeUUID(props.session.uuid)}
              style={{textDecoration: 'none'}}>
            <StyledSharpCard style={{height: "120px"}}>
                <CardContent>
                    <Grid container spacing={1} direction={"column"}>
                        <CardItem label={"Started"}>
                            <Moment calendar>{props.session.time_created}</Moment>
                        </CardItem>
                        <CardItem
                            label={"Tasks"}>{props.session.task_count ? props.session.task_count : "0"}
                        </CardItem>
                    </Grid>
                </CardContent>
            </StyledSharpCard>
        </Link>
    )
}

