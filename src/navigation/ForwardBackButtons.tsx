import { useHistory, useLocation } from "react-router";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Box, IconButton, Tooltip } from "@mui/material";

const ForwardBackButtons = () => {
    const { goBack, goForward } = useHistory();
    const location = useLocation();
    // only works in chrome/edge for now.. but better than nothing
    let canGoForward = true;
    // @ts-ignore
    if (window.navigation) {
        canGoForward =
            // @ts-ignore
            !!window?.navigation && window?.navigation?.canGoForward !== false;
    }

    return (
        <Box display="flex" sx={{ gap: 1 }}>
            <Box
                sx={{
                    borderRadius: "50%",
                    backgroundColor: "rgba(0,0,0,0.1)",
                }}
            >
                <IconButton
                    aria-label="go back"
                    disabled={!!!location.key}
                    onClick={goBack}
                >
                    <Tooltip title="Go back">
                        <ArrowBackIosIcon fontSize="small" />
                    </Tooltip>
                </IconButton>
            </Box>
            <Box
                sx={{
                    borderRadius: "50%",
                    backgroundColor: "rgba(0,0,0,0.1)",
                }}
            >
                <IconButton
                    aria-label="go forward"
                    disabled={!canGoForward}
                    onClick={goForward}
                >
                    <Tooltip title="Go forward">
                        <ArrowForwardIosIcon fontSize="small" />
                    </Tooltip>
                </IconButton>
            </Box>
        </Box>
    );
};

export default ForwardBackButtons;
