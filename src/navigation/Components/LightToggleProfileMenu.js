import React from "react";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Link, useHistory } from "react-router-dom";
import { encodeUUID } from "../../utilities";
import { Tooltip } from "@mui/material";
import { setDarkMode } from "../../redux/Actions";
import BrightnessHighIcon from "@mui/icons-material/BrightnessHigh";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import UserAvatar from "../../components/UserAvatar";
import { useDispatch, useSelector } from "react-redux";
import { getWhoami } from "../../redux/Selectors";
import { Auth } from "aws-amplify";
import SignalWifiOff from "@mui/icons-material/SignalWifiOff";
import { showHide } from "../../styles/common";
import { networkStatusSelector } from "../../redux/Selectors";

function LightToggleProfileMenu() {
    const whoami = useSelector(getWhoami);
    const darkMode = useSelector((state) => state.darkMode);
    const [anchorElProfileMenu, setAnchorElProfileMenu] = React.useState(null);
    const dispatch = useDispatch();
    const history = useHistory();
    const networkStatus = useSelector(networkStatusSelector);
    const { show, hide } = showHide();

    return (
        <Grid
            container
            direction={"row-reverse"}
            justifyContent={"flex-start"}
            alignItems={"center"}
        >
            <Grid item>
                <div></div>
            </Grid>
            <Grid item>
                <Grid
                    container
                    direction={"row"}
                    justifyContent={"flex-start"}
                    alignItems={"center"}
                    spacing={1}
                >
                    <Grid item className={networkStatus ? hide : show}>
                        <Tooltip title={"You are working offline"}>
                            <IconButton color="inherit" size="large">
                                <SignalWifiOff />
                            </IconButton>
                        </Tooltip>
                    </Grid>
                    <Grid item>
                        <Tooltip title={"Toggle dark/light mode"}>
                            <IconButton
                                color="inherit"
                                onClick={() => {
                                    dispatch(setDarkMode(!darkMode));
                                }}
                                size="large"
                            >
                                {darkMode ? (
                                    <BrightnessHighIcon />
                                ) : (
                                    <Brightness4Icon />
                                )}
                            </IconButton>
                        </Tooltip>
                    </Grid>
                    <Grid item>
                        <div>
                            <UserAvatar
                                onClick={(event) => {
                                    setAnchorElProfileMenu(event.currentTarget);
                                }}
                                userUUID={whoami.id}
                                displayName={whoami.displayName}
                                avatarURL={whoami.profilePictureThumbnailURL}
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
                                        //dispatch(logoutUser());
                                        history.push("/");
                                        Auth.signOut();
                                    }}
                                >
                                    Logout
                                </MenuItem>
                            </Menu>
                        </div>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default LightToggleProfileMenu;
