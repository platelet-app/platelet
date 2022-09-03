import React from "react";
import RateReviewIcon from "@mui/icons-material/RateReview";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Link } from "react-router-dom";
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
import UserFeedbackDialog from "./UserFeedbackDialog";
import useCurrentTheme from "../../hooks/useCurrentTheme";
import { styled } from "@mui/material/styles";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";

const LightDarkSwitch = styled(Switch)(({ theme }) => ({
    width: 62,
    height: 34,
    padding: 7,
    "& .MuiSwitch-switchBase": {
        margin: 1,
        padding: 0,
        transform: "translateX(6px)",
        "&.Mui-checked": {
            color: "#fff",
            transform: "translateX(22px)",
            "& .MuiSwitch-thumb:before": {
                backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
                    "#fff"
                )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
            },
            "& + .MuiSwitch-track": {
                opacity: 1,
                backgroundColor:
                    theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
            },
        },
    },
    "& .MuiSwitch-thumb": {
        backgroundColor: theme.palette.mode === "dark" ? "#003892" : "#001e3c",
        width: 32,
        height: 32,
        "&:before": {
            content: "''",
            position: "absolute",
            width: "100%",
            height: "100%",
            left: 0,
            top: 0,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
                "#fff"
            )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
        },
    },
    "& .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
        borderRadius: 20 / 2,
    },
}));

function LightToggleProfileMenu() {
    const whoami = useSelector(getWhoami);
    const darkMode = useCurrentTheme();
    const [anchorElProfileMenu, setAnchorElProfileMenu] = React.useState(null);
    const [feedbackOpen, setFeedbackOpen] = React.useState(false);
    const dispatch = useDispatch();
    const networkStatus = useSelector(networkStatusSelector);

    const toggleDarkLightMode = () => {
        // reversing it
        localStorage.setItem("themeMode", darkMode ? "light" : "dark");
        dispatch(setDarkMode(darkMode === "dark" ? "light" : "dark"));
    };

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
            {process.env.REACT_APP_DEMO_MODE !== "true" && (
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

            {/*<Tooltip title={"Toggle dark/light mode"}>
                <IconButton
                    onClick={() => {
                        // reversing it
                        localStorage.setItem(
                            "themeMode",
                            darkMode ? "light" : "dark"
                        );
                        dispatch(
                            setDarkMode(darkMode === "dark" ? "light" : "dark")
                        );
                    }}
                    size="large"
                >
                    {darkMode === "light" ? (
                        <BrightnessHighIcon />
                    ) : (
                        <Brightness4Icon />
                    )}
                </IconButton>
            </Tooltip>*/}
            <div>
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
                            toggleDarkLightMode();
                        }}
                    >
                        <FormControlLabel
                            checked={darkMode === "dark"}
                            labelPlacement="start"
                            sx={{ margin: 0 }}
                            onChange={toggleDarkLightMode}
                            control={
                                <LightDarkSwitch
                                    sx={{ marginLeft: 2 }}
                                    defaultChecked
                                />
                            }
                            label="Theme"
                        />
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
            <UserFeedbackDialog
                onClose={() => setFeedbackOpen(false)}
                open={feedbackOpen}
            />
        </Stack>
    );
}

export default LightToggleProfileMenu;
