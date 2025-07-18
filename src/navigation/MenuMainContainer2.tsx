import * as React from 'react';
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton';
import { Hidden, Stack, useMediaQuery } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from 'tss-react/mui';
import { clearDashboardFilter } from '../redux/dashboardFilter/DashboardFilterActions';
import { menuIndexSelector, dashboardFilterTermSelector } from '../redux/Selectors';
import { SidebarProvider, useSidebar } from './sidebar/SidebarProvider';
import MainWindow from './MainWindow';
import { Sidebar } from './sidebar/Sidebar';
import TaskFilterTextField from '../components/TaskFilterTextfield';
import DashboardDetailTabs from '../scenes/Dashboard/components/DashboardDetailTabs';
import RoleViewSelect from '../scenes/Dashboard/components/RoleViewSelect';
import LightToggleProfileMenu from './Components/LightToggleProfileMenu';
import ForwardBackButtons from './ForwardBackButtons';
import MobileNavigationDrawer from './MobileNavigationDrawer';
import {
    dashboardTabIndexSelector,
} from "../redux/Selectors";

import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }: any) => open,
      style: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    variants: [
      {
        props: ({ open }: any) => open,
        style: {
          ...openedMixin(theme),
          '& .MuiDrawer-paper': openedMixin(theme),
        },
      },
      {
        props: ({ open }: any) => !open,
        style: {
          ...closedMixin(theme),
          '& .MuiDrawer-paper': closedMixin(theme),
        },
      },
    ],
  }),
);

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

export default function MenuMainContainer() {
    const { classes } = useStyles2();
    const [searchMode, setSearchMode] = React.useState(false);
    const dashboardTabIndex = useSelector(dashboardTabIndexSelector);
    const menuIndex = useSelector(menuIndexSelector);
    const currentFilter = useSelector(dashboardFilterTermSelector);
    const toggleIcon = searchMode ? <ArrowBackIcon /> : <SearchIcon />;
    const dispatch = useDispatch();
    const {sidebarOpen} = useSidebar()

    const toggleSearchMode = () => {
        if (searchMode) dispatch(clearDashboardFilter());
        setSearchMode(!searchMode);
    };

    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down("md"));
    const isXs = useMediaQuery(theme.breakpoints.down("sm"));

    const updateSearchMode = React.useCallback(
        (currentFilter, menuIndex, isSm) => {
            if (menuIndex !== "dashboard") {
                setSearchMode(false);
                dispatch(clearDashboardFilter());
            } else if (currentFilter && isSm) {
                setSearchMode((prevState) => {
                    if (!prevState) return true;
                    else return prevState;
                });
            }
        },
        [dispatch]
    );

    React.useEffect(
        () => updateSearchMode(currentFilter, menuIndex, isSm),
        [currentFilter, isSm, menuIndex, updateSearchMode]
    );

    React.useEffect(() => {
        if (!isSm && searchMode) setSearchMode(false);
    }, [isSm, searchMode]);



  return (
    <SidebarProvider>
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position={isSm ? "relative" : "sticky"}
                className={classes.appBar} open={sidebarOpen}>

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
                                <MobileNavigationDrawer />
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
      <Drawer variant="permanent" open={sidebarOpen}>
        <Sidebar/>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <MainWindow />
      </Box>
    </Box>
    </SidebarProvider>
  );
}