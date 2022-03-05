import React from "react";
import { styled } from "@mui/styles";
import { Box, Stack, Typography } from "@mui/material";

const VehicleBox = styled(Box)({
    backgroundColor: "rgba(180, 180, 180, 0.1)",
    padding: "0.5rem",
    width: "100%",
    maxWidth: 500,
});

export default function VehicleCard(props) {
    return (
      <VehicleBox>
          <Stack
              spacing={1}
              justifyContent={"space-between"}
              alignItems={"center"}
              direction={"row"}
          >                    
              <Typography>{props.vehicle.name}</Typography>
              <Typography>
                {props.vehicle.manufacturer + ' ' + props.vehicle.model}
              </Typography>
          </Stack>
        </VehicleBox>

    )
    

}
