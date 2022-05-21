import React from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Link, useHistory } from "react-router-dom";
import { encodeUUID } from "../../utilities";
import { Box, Stack, Tooltip } from "@mui/material";
import { setDarkMode } from "../../redux/Actions";
import BrightnessHighIcon from "@mui/icons-material/BrightnessHigh";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import UserAvatar from "../../components/UserAvatar";
import { useDispatch, useSelector } from "react-redux";
import { getWhoami } from "../../redux/Selectors";
import SignalWifiOff from "@mui/icons-material/SignalWifiOff";
import { networkStatusSelector } from "../../redux/Selectors";
import { logoutUser } from "../../redux/login/LoginActions";
import SyncStatusCircleLoader from "./SyncStatusCircleLoader";

function LightToggleProfileMenu() {
    const whoami = useSelector(getWhoami);
    const darkMode = useSelector((state) => state.darkMode);
    const [anchorElProfileMenu, setAnchorElProfileMenu] = React.useState(null);
    const dispatch = useDispatch();
    const history = useHistory();
    const networkStatus = useSelector(networkStatusSelector);

    return (
        <Stack
            direction={"row"}
            justifyContent={"flex-end"}
            alignItems={"center"}
            spacing={1}
        >
            <Box sx={{ width: 40 }}>
                <SyncStatusCircleLoader />
                {!networkStatus && (
                    <Tooltip title={"You are working offline"}>
                        <IconButton size="large">
                            <SignalWifiOff />
                        </IconButton>
                    </Tooltip>
                )}
            </Box>
            <Tooltip title={"Toggle dark/light mode"}>
                <IconButton
                    onClick={() => {
                        dispatch(setDarkMode(!darkMode));
                    }}
                    size="large"
                >
                    {darkMode ? <BrightnessHighIcon /> : <Brightness4Icon />}
                </IconButton>
            </Tooltip>
            <div>
                <UserAvatar
                    onClick={(event) => {
                        setAnchorElProfileMenu(event.currentTarget);
                    }}
                    userUUID={whoami.id}
                    displayName={whoami.displayName}
                    thumbnailKey={
                        whoami.profilePictureThumbnail
                            ? whoami.profilePictureThumbnail.key
                            : null
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
                            dispatch(logoutUser());
                        }}
                    >
                        Logout
                    </MenuItem>
                </Menu>
            </div>
        </Stack>
    );
}

export default LightToggleProfileMenu;
