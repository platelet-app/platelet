import React, {useEffect, useState} from 'react';
import '../App.css';
import 'typeface-roboto'
import {convertDate, orderTaskList} from '../utilities'
import {StyledAddCircleOutline} from "../css/common";
import Grid from "@material-ui/core/Grid";
import {TaskCard} from "./TaskCardsColoured";
import update from 'immutability-helper';
import TaskDialog from "./TaskModal";
import PropTypes from 'prop-types';
import moment from 'moment/min/moment-with-locales';

import {
    BrowserRouter as Router,
    Link,
    Switch,
    Route,
    useHistory,
    useLocation,
    useParams
} from "react-router-dom";

export default function SessionDetail(props) {

    const [tasks, setTasks] = useState([]);
    const [timestamp, setTimestamp] = useState(new Date());
    const [uuid, setUUID] = useState("");
    const [loaded, setLoaded] = useState(false);

    function setup() {
        props.apiControl.sessions.getSession(props.match.params.session_uuid)
            .then((session_data) => {
                if (session_data) {
                    setTasks(orderTaskList(session_data.tasks));
                    setTimestamp(session_data.timestamp);
                    setUUID(session_data.uuid);
                }
                setLoaded(true);
            });
    }

    useEffect(setup, []);


    let emptyTask = {
        session_id: props.match.params.session_uuid,
        timestamp: new Date().toISOString(),
    };

    function updateCallback(uuid, data) {
        console.log(data)
        let result = tasks.filter(task => task.uuid === uuid);
        if (result.length === 1) {
            const updated_item = {...result[0], ...data};
            const index = tasks.indexOf(result[0]);
            const updated = update(tasks, {[index]: {$set: updated_item}});
            const reordered = orderTaskList(updated);
            setTasks(reordered)

        }
    }

    const circleAdd =
        <StyledAddCircleOutline
            onClick={() => {
                let newTask = {...emptyTask};
                newTask.timestamp = moment.utc().toISOString();
                props.apiControl.tasks.createTask(newTask).then((data) => {
                    newTask.uuid = data.uuid;
                    setTasks([newTask, ...tasks])

                })
            }
            }
        />;
    let location = useLocation();

    if (loaded) {
        return (
            <div style={{paddingLeft: 30, paddingTop: 100, paddingRight: 30, paddingBottom: 100}}>
                <Grid container
                      spacing={3}
                      direction={"row"}
                      justify={"flex-start"}
                      alignItems={"center"}
                >
                    <Grid item xs={10} sm={5} md={4} lg={3}>
                        {circleAdd}
                    </Grid>
                    {tasks.map(task => {
                        return (
                            <Grid item xs={10} sm={5} md={4} lg={3} key={task.uuid}>
                                <Link style={{ textDecoration: 'none' }}
                                    key={task.uuid}
                                    to={{
                                        pathname: `/task/${task.uuid}`,
                                        // This is the trick! This link sets
                                        // the `background` in location state.
                                        state: {background: location}
                                    }}
                                >
                                    <TaskCard
                                        title={"Task"}
                                        pickupAddress={task.pickup_address}
                                        dropoffAddress={task.dropoff_address}
                                        assignedRider={task.rider}
                                        pickupTime={task.pickup_time}
                                        dropoffTime={task.dropoff_time}
                                        timestamp={task.timestamp}
                                        priority={task.priority}
                                    />
                                </Link>

                            </Grid>
                        )
                    })
                    }
                </Grid>
            </div>
        )
    } else {
        return <></>
    }
}


// This example shows how to render two different screens
// (or the same screen in a different context) at the same URL,
// depending on how you got there.
//
// Click the "featured images" and see them full screen. Then
// "visit the gallery" and click on the colors. Note the URL and
// the component are the same as before but now we see them
// inside a modal on top of the gallery screen.

/*export default function ModalGalleryExample() {
    return (
        <Router>
            <ModalSwitch />
        </Router>
    );
}*/


const IMAGES = [
    {id: 0, title: "Dark Orchid", color: "DarkOrchid"},
    {id: 1, title: "Lime Green", color: "LimeGreen"},
    {id: 2, title: "Tomato", color: "Tomato"},
    {id: 3, title: "Seven Ate Nine", color: "#789"},
    {id: 4, title: "Crimson", color: "Crimson"}
];

function Thumbnail({color}) {
    return (
        <div
            style={{
                width: 50,
                height: 50,
                background: color
            }}
        />
    );
}

function Image({color}) {
    return (
        <div
            style={{
                width: "100%",
                height: 400,
                background: color
            }}
        />
    );
}

function Home() {
    return (
        <div>
            <Link to="/gallery">Visit the Gallery</Link>
            <h2>Featured Images</h2>
            <ul>
                <li>
                    <Link to="/img/2">Tomato</Link>
                </li>
                <li>
                    <Link to="/img/4">Crimson</Link>
                </li>
            </ul>
        </div>
    );
}

function Gallery() {
    let location = useLocation();

    return (
        <div>
            {IMAGES.map(i => (
                <Link
                    key={i.id}
                    to={{
                        pathname: `/task/${i.id}`,
                        // This is the trick! This link sets
                        // the `background` in location state.
                        state: {background: location}
                    }}
                >
                    <Thumbnail color={i.color}/>
                    <p>{i.title}</p>
                </Link>
            ))}
        </div>
    );
}

function ImageView() {
    let {id} = useParams();
    let image = IMAGES[parseInt(id, 10)];

    if (!image) return <div>Image not found</div>;

    return (
        <div>
            <h1>{image.title}</h1>
            <Image color={image.color}/>
        </div>
    );
}

function Modal() {
    let history = useHistory();
    let {id} = useParams();
    let image = IMAGES[parseInt(id, 10)];

    if (!image) return null;

    let back = e => {
        e.stopPropagation();
        history.goBack();
    };

    return (
        <div
            onClick={back}
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                background: "rgba(0, 0, 0, 0.15)"
            }}
        >
            <div
                className="modal"
                style={{
                    position: "absolute",
                    background: "#fff",
                    top: 25,
                    left: "10%",
                    right: "10%",
                    padding: 15,
                    border: "2px solid #444"
                }}
            >
                <h1>{image.title}</h1>
                <Image color={image.color}/>
                <button type="button" onClick={back}>
                    Close
                </button>
            </div>
        </div>
    );
}