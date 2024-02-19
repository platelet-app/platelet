import React, { useState } from "react";
import "../App.css";
import { PaddedPaper, ThemedLink } from "../styles/common";
import { encodeUUID, sortByCreatedTime } from "../utilities";
import { useSelector } from "react-redux";
import VehicleCard from "../components/VehicleCard";
import * as models from "../models/index";
import { getWhoami } from "../redux/Selectors";
import { Stack, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { InputAdornment } from "@mui/material";
import { makeStyles } from "tss-react/mui";
import AddToListButton from "../components/AddToListButton";
import useListControls from "../hooks/useListControls";
const useStyles = makeStyles()((theme) => {
    return {
        root: {
            [theme.breakpoints.down("md")]: {
                width: "100%",
            },
        },
        searchIcon: {
            [theme.breakpoints.down("md")]: {
                display: "none",
            },
        },
    };
});
function VehicleList() {
    const whoami = useSelector(getWhoami);
    const [searchText, setSearchText] = useState("");
    const { classes } = useStyles();

    const { state } = useListControls<models.Vehicle>(
        ["name", "manufacturer", "model", "registrationNumber"],
        searchText,
        false,
        models.Vehicle
    );

    const isAdmin = whoami.roles.includes("ADMIN");

    return (
        <Stack
            spacing={2}
            direction={"column"}
            justifyContent={"flex-start"}
            alignItems={"flex-start"}
        >
            <PaddedPaper maxWidth={"800px"}>
                <Stack
                    direction={"column"}
                    spacing={2}
                    alignItems={"flex-start"}
                    justifyContent={"flex-start"}
                >
                    {isAdmin && (
                        <AddToListButton
                            link="/admin/add-vehicle"
                            label="Add new vehicle"
                        />
                    )}
                    <Stack
                        direction={"row"}
                        spacing={2}
                        alignItems={"center"}
                        justifyContent={"flex-start"}
                    >
                        <TextField
                            placeholder={"Filter vehicles..."}
                            onChange={(e) => setSearchText(e.target.value)}
                            className={classes.root}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon
                                            className={classes.searchIcon}
                                        />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Stack>
                </Stack>
            </PaddedPaper>

            <PaddedPaper maxWidth={"800px"}>
                <Stack
                    spacing={1}
                    direction={"column"}
                    justifyContent={"flex-start"}
                >
                    {sortByCreatedTime(Object.values(state), "newest").map(
                        (vehicle: models.Vehicle) => (
                            <ThemedLink
                                to={"/vehicle/" + encodeUUID(vehicle.id)}
                                style={{
                                    textDecoration: "none",
                                }}
                            >
                                <VehicleCard vehicle={vehicle} />
                            </ThemedLink>
                        )
                    )}
                </Stack>
            </PaddedPaper>
        </Stack>
    );
}
export default VehicleList;
