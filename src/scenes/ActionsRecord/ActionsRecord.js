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

function getActionString(HTTPType) {
    switch (HTTPType) {
        case "POST":
            return "created"
        case "PUT":
            return "updated"
        case "DELETE":
            return "deleted"
        default:
            return "unknown actioned"
    }
}

function generateMessage(record) {
    switch (record.http_request_type) {
        case "POST":
        case "DELETE":
            return `${getActionString(record.http_request_type)} this ${record.parent_type}.`
        case "PUT":
            return `${getActionString(record.http_request_type)} ${getFields(record.data_fields)}.`
        default:
            return "Unknown action"
    }

}

function getFields(comma_values) {
    const values = comma_values.split(",")
    if (values.length === 1)
        return values[0]
    return values.map((value, index, arr) => {
            return arr.length - 1 !== index ? `${index !== 0 ? ", " : " "}${value}` : ` and ${value}`
        }
    ).join("")
}

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
                    return (
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
                                    <Typography>{generateMessage(record)}</Typography>
                                </React.Fragment>
                            </TimelineContent>
                        </TimelineItem>
                    )
                })}
            </Timeline>
    );
}
