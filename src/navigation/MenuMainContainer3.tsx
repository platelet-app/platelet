import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import IconButton from "@mui/material/IconButton";
import { drawerWidth, Sidebar } from "./sidebar/Sidebar";
import MainWindow from "./MainWindow";
import { makeStyles } from "tss-react/mui";
import { Stack, Hidden, useMediaQuery } from "@mui/material";
import TaskFilterTextField from "../components/TaskFilterTextfield";
import DashboardDetailTabs from "../scenes/Dashboard/components/DashboardDetailTabs";
import RoleViewSelect from "../scenes/Dashboard/components/RoleViewSelect";
import LightToggleProfileMenu from "./Components/LightToggleProfileMenu";
import ForwardBackButtons from "./ForwardBackButtons";
import { TopbarButton } from "./sidebar/TopbarButton";
import { clearDashboardFilter } from "../redux/dashboardFilter/DashboardFilterActions";
import { useDispatch, useSelector } from "react-redux";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
    dashboardTabIndexSelector,
    menuIndexSelector,
} from "../redux/Selectors";

const useStyles2 = makeStyles()((theme) => {
    return {
        appBarComponents: {
            margin: "auto",
            width: "100%",
            padding: 5,
            color: theme.palette.text.primary,
        },
        appBar: {
            [theme.breakpoints.up("sm")]: {
                width: "100%",
            },
            background: theme.palette.background.paper,
        },
    };
});

interface AppBarProps extends MuiAppBarProps {
    isXs: boolean;
    open: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open, isXs }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open &&
        !isXs && {
            marginLeft: drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`,
            transition: theme.transitions.create(["width", "margin"], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
        }),
}));

export default function MiniDrawer() {
    const menuIndex = useSelector(menuIndexSelector);
    const dashboardTabIndex = useSelector(dashboardTabIndexSelector);
    const { classes } = useStyles2();
    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.down("sm"));
    const [open, setOpen] = React.useState(false);
    const [searchMode, setSearchMode] = React.useState(false);
    const dispatch = useDispatch();
    const toggleIcon = searchMode ? <ArrowBackIcon /> : <SearchIcon />;
    const toggleSearchMode = () => {
        if (searchMode) dispatch(clearDashboardFilter());
        setSearchMode(!searchMode);
    };

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const toggleOpen = () => {
        if (open) {
            handleDrawerClose();
        } else {
            handleDrawerOpen();
        }
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline />
            <AppBar position="fixed" open={open} isXs={isXs}>
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    className={classes.appBarComponents}
                >
                    {searchMode ? (
                        <Stack
                            sx={{ width: "100%" }}
                            direction="row"
                            alignItems="center"
                        >
                            <IconButton
                                onClick={toggleSearchMode}
                                color="inherit"
                                size="large"
                            >
                                {toggleIcon}
                            </IconButton>
                            <TaskFilterTextField />
                        </Stack>
                    ) : (
                        <>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                    paddingRight: 1,
                                }}
                            >
                                <TopbarButton onClick={toggleOpen} />
                                <ForwardBackButtons />
                            </Box>
                            {menuIndex === "dashboard" && (
                                <>
                                    <Hidden mdDown>
                                        <Box
                                            sx={{
                                                width: "100%",
                                                maxWidth: 1100,
                                            }}
                                        >
                                            <DashboardDetailTabs />
                                        </Box>
                                    </Hidden>
                                    <Hidden mdUp>
                                        <IconButton
                                            onClick={toggleSearchMode}
                                            color="inherit"
                                            size="large"
                                        >
                                            {toggleIcon}
                                        </IconButton>
                                    </Hidden>
                                </>
                            )}
                            {isXs &&
                                dashboardTabIndex !== 2 &&
                                menuIndex === "dashboard" && <RoleViewSelect />}
                            <LightToggleProfileMenu />
                        </>
                    )}
                </Stack>
            </AppBar>
            <Sidebar onClose={handleDrawerClose} open={open} />
            <MainWindow />
        </Box>
    );
}
