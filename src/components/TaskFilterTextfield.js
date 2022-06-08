import {
    clearDashboardFilter,
    debounceDashboardFilter,
} from "../redux/dashboardFilter/DashboardFilterActions";
import { InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import makeStyles from "@mui/styles/makeStyles";
import PropTypes from "prop-types";
import { dashboardFilterTermSelector } from "../redux/Selectors";
import { styled } from "@mui/material/styles";

const useStyles = makeStyles((theme) => {
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

const CustomTextField = styled(TextField)({
    "& .MuiOutlinedInput-root": {
        "& fieldset": {
            borderRadius: 10,
        },
        "&:hover fieldset": {
            borderColor: "orange",
        },
    },
});

function TaskFilterTextField({ sx }) {
    const dispatch = useDispatch();
    const currentFilter = useSelector(dashboardFilterTermSelector);
    const [value, setValue] = useState("");
    const classes = useStyles();
    const firstMount = useRef(true);

    function onChangeFilterText(e) {
        setValue(e.target.value);
        dispatch(debounceDashboardFilter(e.target.value));
    }

    useEffect(() => {
        if (!currentFilter) {
            setValue("");
        }
        if (firstMount.current) {
            setValue(currentFilter);
            firstMount.current = false;
        }
    }, [currentFilter]);

    return (
        <CustomTextField
            data-cy="tasks-filter-input"
            variant={"outlined"}
            size={"small"}
            value={value}
            sx={sx}
            fullWidth
            placeholder={"Filter tasks"}
            onChange={onChangeFilterText}
            onKeyUp={(ev) => {
                switch (ev.key) {
                    case "Escape": {
                        dispatch(clearDashboardFilter());
                        setValue("");
                        ev.preventDefault();
                        break;
                    }
                    default:
                        break;
                }
            }}
            color={value ? "secondary" : "primary"}
            className={classes.root}
            inputProps={{
                "aria-label": "Filter tasks",
            }}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon className={classes.searchIcon} />
                    </InputAdornment>
                ),
            }}
        />
    );
}

TaskFilterTextField.propTypes = {
    sx: PropTypes.object,
};

TaskFilterTextField.defaultProps = {
    sx: {},
};

export default TaskFilterTextField;
