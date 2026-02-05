import * as React from "react";
import {
    styled,
    useTheme,
    Box,
    AppBar as MuiAppBar,
    AppBarProps as MuiAppBarProps,
    CssBaseline,
    IconButton,
    Stack,
    Hidden,
    useMediaQuery,
    Container,
} from "@mui/material";
import { Sidebar } from "./sidebar/Sidebar";
import MainWindow from "./MainWindow";
import { makeStyles } from "tss-react/mui";
import TaskFilterTextField from "../components/TaskFilterTextfield";
import DashboardDetailTabs from "../scenes/Dashboard/components/DashboardDetailTabs";
import RoleViewSelect from "../scenes/Dashboard/components/RoleViewSelect";
import LightToggleProfileMenu from "./Components/LightToggleProfileMenu";
import ForwardBackButtons from "./ForwardBackButtons";
import { TopbarButton } from "./sidebar/TopbarButton";
import { clearDashboardFilter } from "../redux/dashboardFilter/DashboardFilterActions";
import { useDispatch, useSelector } from "react-redux";
import { Search, ArrowBack } from "@mui/icons-material";
import {
    dashboardTabIndexSelector,
    menuIndexSelector,
} from "../redux/Selectors";
import { useCordovaBackButton } from "../hooks/useCordovaBackButton";

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
    shouldForwardProp: (prop) => prop !== "open" && prop !== "isXs",
})<AppBarProps>(({ theme, open, isXs }) => ({
    zIndex: theme.zIndex.drawer + 1,
    background: theme.palette.background.paper,
    transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    boxShadow:
        "0px 2px 0px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)",
    ...(open &&
        !isXs && {
            // marginLeft: drawerWidth,
            // width: `calc(100% - ${drawerWidth}px)`,
            transition: theme.transitions.create(["width", "margin"], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
        }),
}));

export function MenuMainContainer() {
    const menuIndex = useSelector(menuIndexSelector);
    const dashboardTabIndex = useSelector(dashboardTabIndexSelector);
    const { classes } = useStyles2();
    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.down("sm"));
    const [open, setOpen] = React.useState(false);
    const [searchMode, setSearchMode] = React.useState(false);
    const dispatch = useDispatch();
    const toggleIcon = searchMode ? <ArrowBack /> : <Search />;
    const toggleSearchMode = () => {
        if (searchMode) dispatch(clearDashboardFilter());
        setSearchMode(!searchMode);
    };

    useCordovaBackButton(() => {
        if (isXs) {
            setOpen(false);
        }
    }, open);

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
        <Box
            style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                width: "100%",
                padding: 0,
            }}
        >
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
            <Container
                style={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    maxWidth: "100%",
                    padding: 0,
                }}
            >
                <Sidebar onClose={handleDrawerClose} open={open} />
                <MainWindow />
            </Container>
        </Box>
    );
}
