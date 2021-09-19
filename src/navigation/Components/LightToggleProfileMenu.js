import React from "react";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { Link, useHistory } from "react-router-dom";
import { encodeUUID } from "../../utilities";
import { logoutUser } from "../../redux/login/LoginActions";
import { Hidden, Tooltip } from "@material-ui/core";
import { setDarkMode } from "../../redux/Actions";
import BrightnessHighIcon from "@material-ui/icons/BrightnessHigh";
import Brightness4Icon from "@material-ui/icons/Brightness4";
import Typography from "@material-ui/core/Typography";
import UserAvatar from "../../components/UserAvatar";
import { useDispatch, useSelector } from "react-redux";

function LightToggleProfileMenu(props) {
    const whoami = useSelector((state) => state.whoami.user);
    const darkMode = useSelector((state) => state.darkMode);
    const [anchorElProfileMenu, setAnchorElProfileMenu] = React.useState(null);
    const dispatch = useDispatch();
    const history = useHistory();
    return (
        <Grid
            container
            direction={"row-reverse"}
            justify={"flex-start"}
            alignItems={"center"}
        >
            <Grid item>
                <div>
                    <IconButton
                        color="inherit"
                        aria-controls="simple-menu"
                        aria-haspopup="true"
                        onClick={(event) => {
                            setAnchorElProfileMenu(event.currentTarget);
                        }}
                    >
                        <ArrowDropDownIcon />
                    </IconButton>
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
                                history.push("/dashboard");
                            }}
                        >
                            Logout
                        </MenuItem>
                    </Menu>
                </div>
            </Grid>
            <Grid item>
                <Grid
                    container
                    direction={"row"}
                    justify={"flex-start"}
                    alignItems={"center"}
                    spacing={1}
                >
                    <Grid item>
                        <Tooltip title={"Toggle dark/light mode"}>
                            <IconButton
                                color="inherit"
                                onClick={() => {
                                    dispatch(setDarkMode(!darkMode));
                                }}
                            >
                                {darkMode ? (
                                    <BrightnessHighIcon />
                                ) : (
                                    <Brightness4Icon />
                                )}
                            </IconButton>
                        </Tooltip>
                    </Grid>
                    <Hidden smDown>
                        <Grid item>
                            <Link
                                to={`/user/${encodeUUID(whoami.id)}`}
                                style={{
                                    textDecoration: "none",
                                    color: "white",
                                }}
                            >
                                <Typography variant="h6" noWrap>
                                    {whoami.displayName}
                                </Typography>
                            </Link>
                        </Grid>
                    </Hidden>
                    <Grid item>
                        <Link
                            to={`/user/${encodeUUID(whoami.id)}`}
                            style={{ textDecoration: "none" }}
                        >
                            <UserAvatar
                                userUUID={whoami.id}
                                displayName={whoami.displayName}
                                avatarURL={whoami.profilePictureThumbnailURL}
                            />
                        </Link>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default LightToggleProfileMenu;
