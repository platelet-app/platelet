import React from "react";
import Grid from "@material-ui/core/Grid";
import AvatarGroup from "@material-ui/lab/AvatarGroup";
import UserAvatar from "../../../components/UserAvatar";
import CollaboratorPickerPopover from "./CollaboratorPickerPopover";


export default function CollaboratorsSection(props) {
    const collaboratorAddButton = (props.allowAdd) ?
        <CollaboratorPickerPopover sessionUUID={props.sessionUUID} collaborators={props.collaborators}/>
         : <></>

    return (
    <Grid container spacing={1} direction={"row"} justify={"flex-left"} alignItems={"center"}>
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
