import React, {useState} from "react"
import {PaddedPaper} from "../../styles/common";
import TasksStatistics from "./components/TasksStatistics";
import {createLoadingSelector} from "../../redux/selectors";
import {useDispatch, useSelector} from "react-redux";
import StatsSkeleton from "./components/StatsSkeleton";
import {getUserStatisticsRequest} from "../../redux/statistics/statisticsActions";
import {DateAndTimePicker} from "../../components/DateTimePickers";
import Button from "@material-ui/core/Button";
import RoleSelect from "../../components/RoleSelect";

function StatisticsDashboard() {
    const loadingSelector = createLoadingSelector(["GET_USER_STATISTICS", "GET_PRIORITIES"]);
    const isFetching = useSelector(state => loadingSelector(state));
    const stats = useSelector(state => state.userStatistics.statistics);
    const whoami = useSelector(state => state.whoami.user);
    const [endDateTime, setEndDateTime] = useState(new Date())
    const [startDateTime, setStartDateTime] = useState(new Date())
    const [role, setRole] = useState("coordinator");
    const dispatch = useDispatch();

    function getStatsData() {
        if (whoami.uuid)
            dispatch(getUserStatisticsRequest(whoami.uuid, role, startDateTime.toISOString(), endDateTime.toISOString()))
    }

        return (
            <PaddedPaper>
                <RoleSelect onSelect={(value) => setRole(value)}/>
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
                <Button onClick={getStatsData}>Generate</Button>
                <TasksStatistics stats={stats}/>
            </PaddedPaper>
        )
}

export default StatisticsDashboard;
