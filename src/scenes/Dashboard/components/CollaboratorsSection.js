import React from "react";
import PropTypes from 'prop-types'
import Grid from "@material-ui/core/Grid";
import AvatarGroup from "@material-ui/lab/AvatarGroup";
import UserAvatar from "../../../components/UserAvatar";
import CollaboratorPickerPopover from "./CollaboratorPickerPopover";


function CollaboratorsSection(props) {
    const collaboratorAddButton = (props.allowAdd) ?
        <CollaboratorPickerPopover coordinatorUUID={props.coordinatorUUID} collaborators={props.collaborators}/>
         : <></>

    return (
    <Grid container spacing={1} direction={"row"} justify={"flex-start"} alignItems={"center"}>
        <Grid item>

            <AvatarGroup>
                {props.collaborators.map((u) =>
                    <UserAvatar size={4} userUUID={u.uuid} displayName={u.display_name} avatarURL={u.avatar_url}/>
                )
                }
            </AvatarGroup>
        </Grid>
        <Grid item>
            {collaboratorAddButton}
        </Grid>
    </Grid>
)

}

CollaboratorsSection.defaultProps = {
    collaborators: [],
    allowAdd: false
}
CollaboratorsSection.propTypes = {
    coordinatorUUID: PropTypes.string,
    allowAdd: PropTypes.bool,
    collaborators: PropTypes.array
}

export default CollaboratorsSection;
