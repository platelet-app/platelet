import React, {useState} from "react"
import {PaddedPaper} from "../../styles/common";
import TasksStatistics from "./components/TasksStatistics";
import {createLoadingSelector} from "../../redux/LoadingSelectors";
import {useDispatch, useSelector} from "react-redux";
import StatsSkeleton from "./components/StatsSkeleton";
import {getUserStatisticsRequest} from "../../redux/statistics/statisticsActions";
import {DateAndTimePicker} from "../../components/DateTimePickers";
import Button from "@material-ui/core/Button";
import RoleSelect from "../../components/RoleSelect";
import ToggleButton from "@material-ui/lab/ToggleButton";
import makeStyles from "@material-ui/core/styles/makeStyles";
import FormControl from "@material-ui/core/FormControl";
import {InputLabel, MenuItem, Select} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

function StatisticsDashboard() {
    const [dateMode, setDateMode] = useState(false);
    const classes = useStyles();
    const loadingSelector = createLoadingSelector(["GET_USER_STATISTICS", "GET_PRIORITIES", "GET_WHOAMI"]);
    const isFetching = useSelector(state => loadingSelector(state));
    const stats = useSelector(state => state.userStatistics.statistics);
    const whoami = useSelector(state => state.whoami.user);
    const [endDateTime, setEndDateTime] = useState(new Date())
    const [startDateTime, setStartDateTime] = useState(new Date())
    const [role, setRole] = useState("coordinator");
    const [days, setDays] = useState(3);
    const dispatch = useDispatch();


    const handleDaysChange = (event) => {
        setDays(event.target.value);
    };


    const picker = dateMode ? <>
            <DateAndTimePicker
                visible={true}
                label={"Start date"}
                onChange={value => setStartDateTime(value)}
                value={startDateTime}/>
            <DateAndTimePicker
                visible={true}
                label={"End date"}
                value={endDateTime}
                onChange={value => setEndDateTime(value)}
            />
        </> :
        <div>
            <FormControl className={classes.formControl}>
                <InputLabel id="demo-simple-select-label">Days</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={days}
                    onChange={handleDaysChange}
                >
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={3}>3</MenuItem>
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={7}>7</MenuItem>
                    <MenuItem value={7}>14</MenuItem>
                    <MenuItem value={7}>30</MenuItem>
                </Select>
            </FormControl>
        </div>

        function getStatsData() {
            if (whoami.uuid) {
                if (dateMode) {
                    dispatch(getUserStatisticsRequest(whoami.uuid, role, startDateTime.toISOString(), endDateTime.toISOString()));
                } else {
                    const timeNow = new Date();
                    const timeBefore = new Date();
                    timeBefore.setDate(timeNow.getDate() - days);
                    dispatch(getUserStatisticsRequest(whoami.uuid, role, timeBefore.toISOString(), timeNow.toISOString()));
                }
            }
    }

        return (
            <PaddedPaper>
                <ToggleButton value={dateMode} onChange={() => setDateMode(!dateMode)}>{dateMode ? "Custom Range" : "Days"}</ToggleButton>
                {picker}
                <RoleSelect onSelect={(value) => setRole(value)}/>
                <Button onClick={getStatsData}>Generate</Button>
                <TasksStatistics stats={stats}/>
            </PaddedPaper>
        )
}

export default StatisticsDashboard;
