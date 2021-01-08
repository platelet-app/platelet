import React from "react";
import UserAvatar from "./UserAvatar";
import Grid from "@material-ui/core/Grid";
import PropTypes from "prop-types"
import Typography from "@material-ui/core/Typography";

function CompactUserCard(props) {
    return (
        <Grid container spacing={1} alignItems={"center"} direction={"row"}>
            <Grid item>
                <UserAvatar userUUID={props.userUUID}
                            displayName={props.displayName}
                            size={3}
                            avatarURL={props.profilePictureURL}/>
            </Grid>
            <Grid item>
                <Grid container direction={"column"}>
                    <Grid container style={{width: "250px"}} direction={"row"} justify={"space-between"} alignItems={"center"}>
                        <Grid item>
                            <Grid item>
                                <Typography>{props.displayName}</Typography>
                            </Grid>
                            <Grid item>
                                <Typography>{props.patch}</Typography>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Grid item>
                                <Typography>{props.vehicleName}</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}

CompactUserCard.propTypes = {
    userUUID: PropTypes.string,
    displayName: PropTypes.string,
    profilePictureURL: PropTypes.string,
    patch: PropTypes.string,
    vehicleName: PropTypes.string
}

CompactUserCard.defaultProps = {
    displayName: "Unknown User",
    patch: "Unknown Patch",
    vehicleName: ""
}

export default CompactUserCard;
