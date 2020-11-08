import React, {useEffect} from 'react';
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent';
import Typography from '@material-ui/core/Typography';
import {useDispatch, useSelector} from "react-redux";
import {getActionsRecordRequest} from "../../redux/actionsRecord/ActionsRecordActions";
import moment from "moment";
import Link from "@material-ui/core/Link";
import {Link as RouterLink} from "react-router-dom";
import {encodeUUID} from "../../utilities";
import {generateMessage} from "./utilities/functions";
import _ from "lodash"

const displayFields = [
    "pickup_address",
    "dropoff_address",
    "patch_id",
    "requester_contact",
    "priority_id",
    "time_of_call",
    "time_picked_up",
    "time_dropped_off",
    "time_cancelled",
    "time_rejected",
]

export default function ActionsRecord(props) {
    const dispatch = useDispatch();
    const records = useSelector(state => state.actionsRecord.actionsRecord);

    function componentDidMount() {
        dispatch(getActionsRecordRequest(props.parentUUID))
    }

    useEffect(componentDidMount, [])

    return (
        <Timeline>
            {records.map((record, index, arr) => {
                if (!record.data_fields)
                return (
                    <React.Fragment key={record.uuid}>
                            <></>
                    </React.Fragment>
                        )
                const fields = _.intersection(record.data_fields.split(","), displayFields);
                if (fields.length > 0) {
                    return (
                        <React.Fragment key={record.uuid}>
                        <TimelineItem>
                            <TimelineOppositeContent>
                                <Typography color="textSecondary">{moment(record.time_created).calendar()}</Typography>
                            </TimelineOppositeContent>
                            <TimelineSeparator>
                                <TimelineDot color={record.http_request_type === "PUT" ? "primary" : "secondary"}/>
                                {arr.length - 1 === index ? <></> : <TimelineConnector/>}
                            </TimelineSeparator>
                            <TimelineContent>
                                <React.Fragment>
                                    <Link component={RouterLink}
                                          to={"/user/" + encodeUUID(record.calling_user.uuid)}>
                                        <Typography
                                            style={{fontWeight: "bold"}}>{record.calling_user.display_name}</Typography>
                                    </Link>
                                    <Typography>{generateMessage(record, fields)}</Typography>
                                </React.Fragment>
                            </TimelineContent>
                        </TimelineItem>
                        </React.Fragment>
                    )
                } else {
                    return (
                    <React.Fragment key={record.uuid}>
                        <></>;
                    </React.Fragment>
                    )
                }
            })}
        </Timeline>
    );
}
