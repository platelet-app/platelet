import React from "react";
import { styled } from "@mui/styles";
import { Box } from "@mui/material";

const VehicleBox = styled(Box)({
    backgroundColor: "rgba(180, 180, 180, 0.1)",
    padding: "0.5rem",
    width: "100%",
    maxWidth: 500,
});

export default function VehicleCard(props) {
    return <VehicleBox>{props.vehicle.name}</VehicleBox>;
}
