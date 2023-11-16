import React from "react";
import { encodeUUID } from "../utilities";
import Typography from "@mui/material/Typography";
import UserAvatar from "./UserAvatar";
import { Box, Stack } from "@mui/material";
import { ThemedLink } from "../styles/common";
import * as models from "../models";
import * as API from "../API";

const sxDisabled = {
    position: "relative",
    "&::before": {
        content: "''",
        position: "absolute",
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.2)",
        zIndex: 1,
    },
    "&::after": {
        content: "'disabled'",
        color: "red",
        fontStyle: "italic",
        position: "absolute",
        top: 10,
        right: 20,
    },
};

type UserCardProps = {
    user: models.User | API.User;
    compact?: boolean;
    thumbnailKey?: string | null;
};

const UserCard: React.FC<UserCardProps> = ({
    user,
    compact = false,
    thumbnailKey = null,
}) => {
    return (
        <ThemedLink
            to={"/user/" + encodeUUID(user.id)}
            style={{ width: "100%", textDecoration: "none" }}
        >
            <Box
                sx={{
                    "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.2)",
                    },
                    borderRadius: 1,
                    width: "100%",
                    maxWidth: 500,
                    ...(user.disabled === 1 ? sxDisabled : {}),
                }}
            >
                <Stack
                    sx={{
                        minWidth: 250,
                        minHeight: 50,
                    }}
                    spacing={1}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                    direction={"row"}
                >
                    <Stack
                        spacing={2}
                        direction={"row"}
                        justifyContent={"flex-start"}
                        alignItems={"center"}
                    >
                        <UserAvatar
                            size={compact ? 3 : 6}
                            userUUID={user.id}
                            displayName={user.displayName}
                            thumbnailKey={thumbnailKey}
                        />
                        <Stack
                            spacing={1}
                            alignItems={"flex-start"}
                            direction={"column"}
                        >
                            <Typography>{user.displayName}</Typography>
                            {user.riderResponsibility ? (
                                <Typography style={{ fontStyle: "italic" }}>
                                    {user.riderResponsibility}
                                </Typography>
                            ) : (
                                <></>
                            )}
                        </Stack>
                    </Stack>
                </Stack>
            </Box>
        </ThemedLink>
    );
};

export default UserCard;
