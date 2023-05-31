import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import { guidedSetupOpenSelector } from "../../../redux/Selectors";
import { useSelector } from "react-redux";
import { GuidedSetup } from "../../GuidedSetup/GuidedSetup";

const drawerMaxWidth = 400;

export default function GuidedSetupDrawer() {
    const guidedSetupOpen = useSelector(guidedSetupOpenSelector);

    return (
        <Box sx={{ display: "flex" }}>
            <Drawer
                sx={{
                    width: drawerMaxWidth,
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        width: "100%",
                        maxWidth: drawerMaxWidth,
                        boxSizing: "border-box",
                    },
                }}
                variant="persistent"
                anchor="right"
                open={guidedSetupOpen}
            >
                {guidedSetupOpen && <GuidedSetup />}
            </Drawer>
        </Box>
    );
}
