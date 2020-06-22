import React, {useEffect, useState} from "react";
import {PaddedPaper} from "../../../styles/common";
import Grid from "@material-ui/core/Grid";
import {useDispatch, useSelector} from "react-redux";
import {getSessionStatistics} from "../../../redux/sessions/SessionsActions";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {createLoadingSelector} from "../../../redux/selectors";
import StatsSkeleton from "../../components/SessionDetail/StatsSkeleton";

function getTitle(key) {
    switch (key) {
        case "num_tasks":
            return "Total";
        case "num_deleted":
            return "Deleted";
        case "num_completed":
            return "Completed";
        case "num_picked_up":
            return "Picked up";
        case "num_active":
            return "Active";
        case "num_unassigned":
            return "Unassigned";
        case "num_rejected":
            return "Rejected";
        case "num_cancelled":
            return "Cancelled";
        case "time_active":
            return "Time Active";
        case "unassigned":
            return "Unassigned";
        default:
            return key;

    }
}

function pad(num) {
    return ("0"+num).slice(-2);
}
function hhmmss(secs) {
    var minutes = Math.floor(secs / 60);
    secs = secs%60;
    var hours = Math.floor(minutes/60)
    minutes = minutes%60;
    return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
}


function CommonStats(props) {
    const columns = [
        "num_completed",
        "num_picked_up",
        "num_active",
        "num_unassigned",
        "num_rejected",
        "num_cancelled",
        "num_tasks",
        "time_active",
    ];
    return (
        <TableContainer component={PaddedPaper}>
            <Table size={"small"} style={{minWidth: "600px"}} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        {columns.map((key) => (
                            <TableCell key={key}>{getTitle(key)}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        {columns.map((key) => {
                            if (key === "time_active")
                                return <TableCell key={key}>{hhmmss(props.stats[key])}</TableCell>;
                            else
                                return <TableCell key={key}
                                                  style={{fontWeight: key === "num_tasks" ? "bold" : "none"}}>{props.stats[key]}</TableCell>
                        })}
                    </TableRow>

                </TableBody>
            </Table>
        </TableContainer>


    )


}

function PatchStats(props) {
    const priorities = useSelector(state => state.availablePriorities.priorities);
    let columns = ["Patch"];
    columns.push(...priorities.map((p) => p.label));
    columns.push("None");
    columns.push("Total");

    return (
        <TableContainer component={PaddedPaper}>
            <Table size={"small"} style={{minWidth: "600px"}} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        {columns.map((title) => (
                            <TableCell key={title}>{title}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Object.keys(props.stats.patches ? props.stats.patches : {}).map((patch) => {
                        return (
                            <TableRow key={patch} align="right">
                                {columns.map((column) => (
                                    column === "Patch" ? <TableCell key={column}>{patch}</TableCell> :
                                        <TableCell key={column}>{props.stats.patches[patch][column]}</TableCell>
                                ))}

                            </TableRow>
                        )

                    })}
                    <TableRow align="right">
                        {columns.map((column) => {
                            if (column === "Total")
                                return <TableCell key={column}
                                    style={{fontWeight: "bold"}}>{props.stats.num_tasks ? props.stats.num_tasks : ""}</TableCell>;
                            else if (column === "Patch")
                                return <TableCell key={column} style={{fontWeight: "bold"}}>Totals:</TableCell>;
                            else
                                return <TableCell key={column}
                                    style={{fontWeight: "bold"}}>{props.stats.priorities ? props.stats.priorities[column] : ""}</TableCell>
                        })}
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    )

}

function RiderStats(props) {
    const priorities = useSelector(state => state.availablePriorities.priorities);
    const [priorityTotals, setPriorityTotals] = useState({})
    let columns = ["Assignee"];
    columns.push(...priorities.map((p) => p.label));
    columns.push("None");
    columns.push("Total");
    let totals = {};
    function calculatePriorityTotals() {
        // for each priority create an entry for that label
        for (const priority of priorities) {
            totals[priority.label] = 0;
            // for each rider sum the total amounts for each priority
            for (const displayName in props.stats.riders) {
                totals[priority.label] += props.stats.riders[displayName][priority.label]
            }
        }
        totals["None"] = 0;
        // sum the total for unassigned tasks
        for (const displayName in props.stats.riders) {
            totals["None"] += props.stats.riders[displayName]["None"]
        }
        setPriorityTotals(totals);
    }
    useEffect(calculatePriorityTotals, [props.stats.riders])

    return (
        <TableContainer component={PaddedPaper}>
            <Table size={"small"} style={{minWidth: "600px"}} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        {columns.map((title) => (
                            <TableCell key={title}>{title}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Object.keys(props.stats.riders ? props.stats.riders : {}).map((rider) => {
                        return (
                            <TableRow key={rider} align="right">
                                {columns.map((column) => (
                                    column === "Assignee" ? <TableCell key={column}>{rider}</TableCell> :
                                        <TableCell key={column}>{props.stats.riders[rider][column]}</TableCell>
                                ))}

                            </TableRow>
                        )

                    })}
                    <TableRow align="right">
                        {columns.map((column) => {
                            if (column === "Total")
                                return <TableCell key={column}
                                    style={{fontWeight: "bold"}}>{props.stats.num_all_riders ? props.stats.num_all_riders : ""}</TableCell>;
                            else if (column === "Assignee")
                                return <TableCell key={column} style={{fontWeight: "bold"}}>Totals:</TableCell>;
                            else
                                return <TableCell key={column}
                                    style={{fontWeight: "bold"}}>{priorityTotals[column]}</TableCell>
                        })}
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    )

}

export default function TasksStatistics(props) {
    const loadingSelector = createLoadingSelector(["GET_SESSION_STATISTICS", "GET_PRIORITIES"]);
    const isFetching = useSelector(state => loadingSelector(state));
    const stats = useSelector(state => state.sessionStatistics.statistics);
    const dispatch = useDispatch();

    function componentDidMount() {
        dispatch(getSessionStatistics(props.sessionUUID))
    }

    useEffect(componentDidMount, []);

    if (isFetching) {
        return <StatsSkeleton/>
    } else {

        return (
            <Grid container direction={"column"} spacing={3}>
                <Grid item>
                    <CommonStats stats={stats}/>
                </Grid>
                <Grid item>
                    <RiderStats stats={stats}/>
                </Grid>
                <Grid item>
                    <PatchStats stats={stats}/>
                </Grid>
            </Grid>
        )
    }
}
