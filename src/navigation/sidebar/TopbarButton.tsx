import { IconButton } from "@mui/material";
import { useSidebar } from "./SidebarProvider";
import MenuIcon from "@mui/icons-material/Menu";

export const TopbarButton = () => {
    const { toggleSidebar } = useSidebar();

    return (
        <IconButton onClick={toggleSidebar} color="inherit" size="large">
            <MenuIcon />
        </IconButton>
    );
}