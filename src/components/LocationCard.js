import {Link} from "react-router-dom";
import {encodeUUID} from "../utilities";
import {StyledSharpCard} from "../styles/common";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import CardItem from "./CardItem";
import React from "react";

export default function LocationCard(props) {
    return (
        <Link to={"/location/" + encodeUUID(props.uuid)}
              style={{textDecoration: 'none'}}>
            <StyledSharpCard style={{height: "120px"}}>
                <CardContent>
                    <Grid container spacing={1} direction={"column"}>
                        <CardItem>
                            {props.name}
                        </CardItem>
                    </Grid>
                </CardContent>
            </StyledSharpCard>
        </Link>
    )
}

