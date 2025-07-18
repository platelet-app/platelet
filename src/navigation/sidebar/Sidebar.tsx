import { Stack, IconButton, Drawer } from "@mui/material"
import { useSidebar } from "./SidebarProvider"
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { makeStyles } from 'tss-react/mui';
import { SidebarDrawerItems } from "./SidebarDrawerItems";

const useStyles = makeStyles()({
    list: {
        width: 250,
    },
});

export const Sidebar = () => {

    const { sidebarOpen, toggleSidebar } = useSidebar()
    const { classes } = useStyles();

    return (
        <Drawer variant="permanent" open={sidebarOpen}>
            <Stack
                direction="column"
                alignItems="flex-end"
                justifyContent="center"
            >
                <IconButton onClick={toggleSidebar}>
                    <ArrowBackIcon />
                </IconButton>
                <SidebarDrawerItems
                    className={classes.list}
                    onSelect={toggleSidebar}
                />
            </Stack>
        </Drawer>
    )
}