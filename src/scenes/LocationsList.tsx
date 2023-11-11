import React from "react";
import { useSelector } from "react-redux";
import LocationCard from "../components/LocationCard";
import { PaddedPaper } from "../styles/common";
import { getWhoami } from "../redux/Selectors";
import * as models from "../models/index";
import { FormControlLabel, Stack, Switch, TextField } from "@mui/material";
import { makeStyles } from "tss-react/mui";
import SearchIcon from "@mui/icons-material/Search";
import { InputAdornment } from "@mui/material";
import useListControls from "../hooks/useListControls";
import AddToListButton from "../components/AddToListButton";

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

function sortByName(a: models.Location, b: models.Location) {
    if (!a.name) {
        return -1;
    }
    return a.name.localeCompare(b.name || "");
}
export default function LocationsList() {
    const whoami = useSelector(getWhoami);
    const { classes } = useStyles();
    const [hideDisabled, setHideDisabled] = React.useState(true);
    const [searchText, setSearchText] = React.useState("");

    const { state } = useListControls<models.Location>(
        ["name"],
        searchText,
        hideDisabled,
        models.Location
    );

    const isAdmin = whoami.roles.includes("ADMIN");
    return (
        <Stack
            direction={"column"}
            spacing={3}
            alignItems={"flex-start"}
            justifyContent={"center"}
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
                            link="/admin/add-location"
                            label="Add new location"
                        />
                    )}
                    <Stack
                        direction={"row"}
                        spacing={2}
                        alignItems={"center"}
                        justifyContent={"flex-start"}
                    >
                        <TextField
                            placeholder={"Filter locations..."}
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
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={!hideDisabled}
                                    onChange={(e) =>
                                        setHideDisabled(!e.target.checked)
                                    }
                                />
                            }
                            label="Show disabled"
                        />
                    </Stack>
                </Stack>
            </PaddedPaper>
            <PaddedPaper maxWidth={"800px"}>
                <Stack direction={"column"} spacing={0}>
                    {Object.values(state.sort(sortByName)).map((loc) => {
                        return <LocationCard key={loc.id} location={loc} />;
                    })}
                </Stack>
            </PaddedPaper>
        </Stack>
    );
}
