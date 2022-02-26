import React, { useEffect, useState } from "react";
import { PaddedPaper } from "../../../styles/common";
import Grid from "@mui/material/Grid";
import { useSelector } from "react-redux";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { priorities, tasksStatus } from "../../../apiConsts";

function getTitle(key) {
    switch (key) {
        case "TOTAL":
            return "Total";
        case tasksStatus.completed:
            return "Completed";
        case tasksStatus.pickedUp:
            return "Picked up";
        case tasksStatus.droppedOff:
            return "Delivered";
        case tasksStatus.active:
            return "Active";
        case tasksStatus.new:
            return "Unassigned";
        case tasksStatus.rejected:
            return "Rejected";
        case tasksStatus.cancelled:
            return "Cancelled";
        case tasksStatus.abandoned:
            return "Abandoned";
        default:
            return key;
    }
}

function pad(num) {
    return ("0" + num).slice(-2);
}
function hhmmss(secs) {
    var minutes = Math.floor(secs / 60);
    secs = secs % 60;
    var hours = Math.floor(minutes / 60);
    minutes = minutes % 60;
    return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
}

function CommonStats(props) {
    const columns = [...Object.values(tasksStatus), "TOTAL"];
    return (
        <TableContainer>
            <Table
                size={"small"}
                style={{ minWidth: "600px" }}
                aria-label="simple table"
            >
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
                                return (
                                    <TableCell key={key}>
                                        {hhmmss(props.stats[key])}
                                    </TableCell>
                                );
                            else
                                return (
                                    <TableCell
                                        key={key}
                                        style={{
                                            fontWeight:
                                                key === "numTasks"
                                                    ? "bold"
                                                    : "none",
                                        }}
                                    >
                                        {props.stats[key]}
                                    </TableCell>
                                );
                        })}
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
}

function PatchStats(props) {
    let columns = [
        "Responsibility",
        ...Object.values(priorities),
        "None",
        "Total",
    ];

    return (
        <TableContainer>
            <Table
                size={"small"}
                style={{ minWidth: "600px" }}
                aria-label="responsibilities table"
            >
                <TableHead>
                    <TableRow>
                        {columns.map((title) => (
                            <TableCell key={title}>{title}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Object.keys(props.stats || {}).map((patch) => {
                        return (
                            <TableRow key={patch} align="right">
                                {columns.map((column) =>
                                    column === "Responsibility" ? (
                                        <TableCell key={column}>
                                            {patch}
                                        </TableCell>
                                    ) : (
                                        <TableCell key={column}>
                                            {
                                                props.stats[patch][
                                                    column.toUpperCase()
                                                ]
                                            }
                                        </TableCell>
                                    )
                                )}
                            </TableRow>
                        );
                    })}
                    <TableRow align="right">
                        {columns.map((column) => {
                            if (column === "Responsibility")
                                return (
                                    <TableCell
                                        key={column}
                                        style={{ fontWeight: "bold" }}
                                    >
                                        Totals:
                                    </TableCell>
                                );
                            else
                                return (
                                    <TableCell
                                        key={column}
                                        style={{ fontWeight: "bold" }}
                                    >
                                        {props.stats &&
                                        props.stats[column.toUpperCase()]
                                            ? props.stats[column.toUpperCase()][
                                                  "Total"
                                              ]
                                            : ""}
                                    </TableCell>
                                );
                        })}
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
}

function RiderStats(props) {
    let columns = ["Assignee", ...Object.values(priorities), "None", "Total"];

    return (
        <TableContainer>
            <Table
                size={"small"}
                style={{ minWidth: "600px" }}
                aria-label="statistics table"
            >
                <TableHead>
                    <TableRow>
                        {columns.map((title) => (
                            <TableCell key={title}>{title}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Object.keys(props.stats ? props.stats : {}).map(
                        (rider) => {
                            return (
                                <TableRow key={rider} align="right">
                                    {columns.map((column) =>
                                        column === "Assignee" ? (
                                            <TableCell key={column}>
                                                {rider}
                                            </TableCell>
                                        ) : (
                                            <TableCell key={column}>
                                                {
                                                    props.stats[rider][
                                                        column.toUpperCase()
                                                    ]
                                                }
                                            </TableCell>
                                        )
                                    )}
                                </TableRow>
                            );
                        }
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default function TasksStatistics(props) {
    return (
        <Grid container direction={"column"} spacing={3}>
            <Grid item>
                <CommonStats stats={props.data.common} />
            </Grid>
            <Grid item>
                <RiderStats stats={props.data.riders} />
            </Grid>
            <Grid item>
                <PatchStats stats={props.data.riderResponsibilities} />
            </Grid>
        </Grid>
    );
}
