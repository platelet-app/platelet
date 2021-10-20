import React from "react";
import UserAvatar from "./UserAvatar";
import Grid from "@mui/material/Grid";
import PropTypes from "prop-types";
import Typography from "@mui/material/Typography";

function CompactUserCard(props) {
    return (
        <Grid
            container
            style={{ width: "100%" }}
            spacing={1}
            alignItems={"center"}
            justifyContent={"space-between"}
            direction={"row"}
        >
            <Grid item>
                <Grid
                    container
                    spacing={1}
                    alignItems={"center"}
                    justifyContent={"flex-start"}
                    direction={"row"}
                >
                    <Grid item>
                        <UserAvatar
                            userUUID={props.userUUID}
                            displayName={props.displayName}
                            size={3}
                            avatarURL={props.profilePictureURL}
                        />
                    </Grid>
                    <Grid item>
                        <Grid container direction={"column"}>
                            <Grid item>
                                <Typography>{props.displayName}</Typography>
                            </Grid>
                            <Grid item>
                                <Typography>{props.responsibility}</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item>
                <Typography>{props.vehicleName}</Typography>
            </Grid>
        </Grid>
    );
}

CompactUserCard.propTypes = {
    userUUID: PropTypes.string,
    displayName: PropTypes.string,
    profilePictureURL: PropTypes.string,
    responsibility: PropTypes.string,
    vehicleName: PropTypes.string,
};

CompactUserCard.defaultProps = {
    displayName: "Unknown User",
    responsibility: "",
    vehicleName: "",
};

export default CompactUserCard;
