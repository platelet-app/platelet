import {TextFieldControlled} from "./TextFields";
import {clearDashboardFilter, debounceDashboardFilter} from "../redux/dashboardFilter/DashboardFilterActions";
import {InputAdornment} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(theme => {
    return {
        root: {
            "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                borderColor: "white",
            },
            "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                borderColor: "white"
            },
            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "white",
            },
            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-input": {
                color: "white"
            },
            "& .MuiInputLabel-outlined.Mui-focused": {
                color: "white"
            },
            [theme.breakpoints.down("sm")]: {
                width: 110
            }
        },
        searchIcon: {color: "white"},
    }
});


export default function TaskFilterTextField(props) {
    const dispatch = useDispatch();
    const dashboardFilterValue = useSelector(state => state.dashboardFilter);
    const classes = useStyles();
    function onChangeFilterText(e) {
        dispatch(debounceDashboardFilter(e.target.value));
    }

    return (
    <TextFieldControlled
        variant={"outlined"}
        value={dashboardFilterValue}
        onChange={onChangeFilterText}
        onPressEscape={() => dispatch(clearDashboardFilter())}
        color={"secondary"}
        className={classes.root}
        InputProps={{
            startAdornment: (
                <InputAdornment position="start">
                    <SearchIcon className={classes.searchIcon}/>
                </InputAdornment>
            ),
        }}
    />
    )
}

