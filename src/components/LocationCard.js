import { encodeUUID } from "../utilities";
import React from "react";
import { styled } from "@mui/styles";
import { Box } from "@mui/material";
import { ThemedLink } from "../styles/common";

const LocBox = styled(Box)({
    backgroundColor: "rgba(180, 180, 180, 0.1)",
    padding: "0.5rem",
    width: "100%",
    maxWidth: 500,
});

export default function LocationCard(props) {
    return (
        <ThemedLink
            to={"/location/" + encodeUUID(props.uuid)}
            style={{ textDecoration: "none" }}
        >
            <LocBox>{props.name}</LocBox>
        </ThemedLink>
    );
}
