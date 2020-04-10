import React, {useEffect} from "react";
import {PaddedPaper} from "../css/common";
import Grid from "@material-ui/core/Grid";
import {useDispatch, useSelector} from "react-redux";
import {getSessionStatistics} from "../redux/sessions/Actions";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {createLoadingSelector} from "../redux/selectors";
import TasksGridSkeleton from "../loadingComponents/TasksGridSkeleton";
import StatsSkeleton from "../loadingComponents/StatsSkeleton";

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
        case "unassigned":
            return "Unassigned";
        default:
            return key;

    }
}

function getDataFromKey(data, key) {

}

export default function TasksStatistics(props) {
    const loadingSelector = createLoadingSelector(["GET_SESSION_STATISTICS", "GET_PRIORITIES"]);
    const isFetching = useSelector(state => loadingSelector(state));
    const stats = useSelector(state => state.sessionStatistics);
    const priorities = useSelector(state => state.availablePriorities);
    const dispatch = useDispatch();

    function componentDidMount() {
        dispatch(getSessionStatistics(props.sessionUUID))
    }

    useEffect(componentDidMount, []);

    let columns = ["Assignee"];
    columns.push(...priorities.map((p) => p.label));
    columns.push("None");
    columns.push("Total");

    if (isFetching) {
        return <StatsSkeleton/>
    }
    else {

        return (
            <TableContainer component={PaddedPaper}>
                <Table size={"small"} style={{minWidth: "600px"}} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            {columns.map((title) => (
                                <TableCell>{title}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Object.keys(stats.riders ? stats.riders : {}).map((rider) => {
                            return (
                                <TableRow align="right">
                                    {columns.map((column) => (
                                        column === "Assignee" ? <TableCell>{rider}</TableCell> :
                                            <TableCell>{stats.riders[rider][column]}</TableCell>
                                    ))}

                                </TableRow>
                            )

                        })}
                        <TableRow align="right">
                            {columns.map((column) => {
                                if (column === "Total")
                                    return <TableCell
                                        style={{fontWeight: "bold"}}>{stats.num_tasks ? stats.num_tasks : ""}</TableCell>;
                                else if (column == "Assignee")
                                    return <TableCell style={{fontWeight: "bold"}}>Totals:</TableCell>;
                                else
                                    return <TableCell
                                        style={{fontWeight: "bold"}}>{stats.priorities ? stats.priorities[column] : ""}</TableCell>
                            })}
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        )
    }
}

