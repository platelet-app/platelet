import React from "react";
import RateReviewIcon from "@mui/icons-material/RateReview";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Link } from "react-router-dom";
import { encodeUUID } from "../../utilities";
import { Box, Stack, Tooltip } from "@mui/material";
import UserAvatar from "../../components/UserAvatar";
import { useDispatch, useSelector } from "react-redux";
import { getWhoami } from "../../redux/Selectors";
import SignalWifiOff from "@mui/icons-material/SignalWifiOff";
import { networkStatusSelector } from "../../redux/Selectors";
import { logoutUser } from "../../redux/login/LoginActions";
import SyncStatusCircleLoader from "./SyncStatusCircleLoader";
import UserFeedbackDialog from "./UserFeedbackDialog";
import { useTheme, useMediaQuery } from "@mui/material";

function LightToggleProfileMenu() {
    const whoami = useSelector(getWhoami);
    const [anchorElProfileMenu, setAnchorElProfileMenu] = React.useState(null);
    const [feedbackOpen, setFeedbackOpen] = React.useState(false);
    const dispatch = useDispatch();
    const networkStatus = useSelector(networkStatusSelector);
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        <Stack
            direction={"row"}
            justifyContent={"flex-end"}
            alignItems={"center"}
            spacing={1}
        >
            <Box>
                <SyncStatusCircleLoader />
                {process.env.REACT_APP_DEMO_MODE !== "true" &&
                    !networkStatus && (
                        <Tooltip title={"You are working offline"}>
                            <IconButton size="large">
                                <SignalWifiOff />
                            </IconButton>
                        </Tooltip>
                    )}
            </Box>
            {process.env.REACT_APP_DEMO_MODE !== "true" && !isSm && (
                <Tooltip title={"Send feedback"}>
                    <IconButton
                        onClick={() => {
                            setFeedbackOpen(true);
                        }}
                        aria-label="send feedback"
                        size="large"
                    >
                        <RateReviewIcon />
                    </IconButton>
                </Tooltip>
            )}
            <React.Fragment>
                <UserAvatar
                    onClick={(event) => {
                        setAnchorElProfileMenu(event.currentTarget);
                    }}
                    userUUID={whoami.id}
                    displayName={whoami.displayName}
                    thumbnailKey={
                        whoami.profilePicture ? whoami.profilePicture.key : null
                    }
                />

                <Menu
                    id="profile-menu"
                    anchorEl={anchorElProfileMenu}
                    keepMounted
                    open={Boolean(anchorElProfileMenu)}
                    onClose={() => {
                        setAnchorElProfileMenu(null);
                    }}
                >
                    <MenuItem
                        onClick={() => {
                            setAnchorElProfileMenu(null);
                        }}
                        component={Link}
                        to={`/user/${encodeUUID(whoami.id)}`}
                    >
                        Profile
                    </MenuItem>
                    <MenuItem
                        onClick={() => {
                            setAnchorElProfileMenu(null);
                        }}
                        component={Link}
                        target="_blank"
                        to={{ pathname: "https://docs.platelet.app" }}
                    >
                        Help
                    </MenuItem>
                    <MenuItem
                        onClick={() => {
                            setAnchorElProfileMenu(null);
                            dispatch(logoutUser());
                        }}
                    >
                        Logout
                    </MenuItem>
                </Menu>
            </React.Fragment>
            <UserFeedbackDialog
                onClose={() => setFeedbackOpen(false)}
                open={feedbackOpen}
            />
        </Stack>
    );
}

export default LightToggleProfileMenu;
