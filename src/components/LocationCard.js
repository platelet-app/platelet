import { encodeUUID } from "../utilities";
import React from "react";
import { Box } from "@mui/material";
import { ThemedLink } from "../styles/common";

const sxDisabled = {
    position: "relative",
    "&::before": {
        content: "''",
        position: "absolute",
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.2)",
        zIndex: 1,
    },
    "&::after": {
        content: "'disabled'",
        color: "red",
        fontStyle: "italic",
        position: "absolute",
        top: 10,
        right: 20,
    },
};

export default function LocationCard({ location }) {
    return (
        <ThemedLink
            to={"/location/" + encodeUUID(location.id)}
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
                    ...(location.disabled === 1 ? sxDisabled : {}),
                }}
            >
                <Box sx={{ padding: 1 }}>{location.name}</Box>
            </Box>
        </ThemedLink>
    );
}
