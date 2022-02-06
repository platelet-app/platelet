import React from "react";
import { Divider, Drawer, Hidden, Stack, useTheme } from "@mui/material";
import CommentsSection from "../../Comments/CommentsSection";
import TaskAssignmentsPanel from "./TaskAssignmentsPanel";

export default function CommentsSideBar(props) {
    const theme = useTheme();
    return (
        <Hidden smDown implementation="css">
            <Drawer
                sx={{
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        width: props.width,
                        boxSizing: "border-box",
                        background: theme.palette.background.default,
                        padding: 1,
                    },
                }}
                anchor={"right"}
                variant="permanent"
            >
                <Stack direction={"column"} spacing={2}>
                    <TaskAssignmentsPanel taskId={props.taskId} />
                    <Divider />
                    <CommentsSection parentId={props.parentUUID} />
                </Stack>
            </Drawer>
        </Hidden>
    );
}
