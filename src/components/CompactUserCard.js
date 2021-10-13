import React from "react";
import UserAvatar from "./UserAvatar";
import Grid from "@material-ui/core/Grid";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";

function CompactUserCard(props) {
    return (
        <Grid
            container
            style={{ width: "100%" }}
            spacing={1}
            alignItems={"center"}
            justify={"space-between"}
            direction={"row"}
        >
            <Grid item>
                <Grid
                    container
                    spacing={1}
                    alignItems={"center"}
                    justify={"flex-start"}
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
                                <Typography>{props.patch}</Typography>
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
    patch: PropTypes.string,
    vehicleName: PropTypes.string,
};

CompactUserCard.defaultProps = {
    displayName: "Unknown User",
    patch: "",
    vehicleName: "",
};

export default CompactUserCard;
