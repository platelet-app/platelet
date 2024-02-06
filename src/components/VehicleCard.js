import React from "react";
import { Box, Typography } from "@mui/material";
import { encodeUUID } from "../utilities";
import { ThemedLink } from "../styles/common";

export default function VehicleCard({ vehicle }) {
    return (
        <ThemedLink
            to={"/vehicle/" + encodeUUID(vehicle.id)}
            style={{ textDecoration: "none" }}
        >
            <Box
                sx={{
                    "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.2)",
                    },
                    borderRadius: 1,
                    width: "100%",
                    maxWidth: 500,
                }}
            >
                <Box sx={{ padding: 1 }}>
                    <Typography>{vehicle.name}</Typography>
                    <Typography style={{ fontStyle: "italic" }}>
                        {vehicle.manufacturer + " " + vehicle.model}
                    </Typography>
                </Box>
            </Box>
        </ThemedLink>
    );
}
