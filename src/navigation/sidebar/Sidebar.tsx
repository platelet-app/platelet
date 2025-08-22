import {
    Stack,
    IconButton,
    useMediaQuery,
    useTheme,
    styled,
    CSSObject,
    Theme,
    Box,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { makeStyles } from "tss-react/mui";
import { SidebarDrawerItems } from "./SidebarDrawerItems";
import MuiDrawer from "@mui/material/Drawer";

export const drawerWidth = 250;

const useStyles = makeStyles()({
    list: {
        width: drawerWidth,
    },
    closedList: {
        width: "100%",
    },
    topBox: {
        height: 58,
        alignContent: "center",
    },
});

const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up("sm")]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const Drawer = styled(MuiDrawer)<{
    open: boolean;
    isXs: boolean;
}>(({ theme, open, isXs }) => {
    if (isXs) {
        // Do not override styles for temporary drawer (mobile)
        return {};
    }
    // Only apply mini-variant styles for permanent drawer
    return {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: "nowrap",
        boxSizing: "border-box",
        ...(open
            ? {
                  ...openedMixin(theme),
                  "& .MuiDrawer-paper": openedMixin(theme),
              }
            : {
                  ...closedMixin(theme),
                  "& .MuiDrawer-paper": closedMixin(theme),
              }),
    };
});

export interface SidebarProps {
    onClose: () => void;
    open: boolean; // Optional prop to control the open state
}

export const Sidebar: React.FC<SidebarProps> = ({ onClose, open }) => {
    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.down("sm"));
    const { classes } = useStyles();

    // For temporary drawer, pass onClose prop so it can close on backdrop click
    return (
        <Drawer
            variant={isXs ? "temporary" : "permanent"}
            open={open}
            onClose={isXs ? onClose : undefined}
            ModalProps={isXs ? { keepMounted: true } : undefined} // Better mobile performance
            isXs={isXs}
        >
            <Stack
                direction="column"
                alignItems="flex-end"
                justifyContent="center"
            >
                <Box className={classes.topBox}>
                    <IconButton onClick={onClose}>
                        <ArrowBackIcon />
                    </IconButton>
                </Box>
                <SidebarDrawerItems
                    open={open}
                    className={open ? classes.list : classes.closedList}
                    onSelect={onClose}
                />
            </Stack>
        </Drawer>
    );
};
