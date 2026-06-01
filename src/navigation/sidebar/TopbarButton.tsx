import { IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

export interface TopbarButtonProps {
    onClick: () => void;
}

export const TopbarButton: React.FC<TopbarButtonProps> = ({ onClick }) => {
    return (
        <IconButton onClick={onClick} color="inherit" size="large">
            <MenuIcon />
        </IconButton>
    );
};
