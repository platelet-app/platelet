import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import makeStyles from "@mui/styles/makeStyles";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { v4 as uuidv4 } from "uuid";

import { encodeUUID } from "../../utilities";

import { CustomizedDialogs } from "../../components/CustomizedDialogs";
import { Step1, Step2, Step3, Step4, Step5 } from "./index";
import { getWhoami } from "../../redux/Selectors";

const TabPanel = (props) => {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
};

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

const a11yProps = (index) => {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    };
};

const guidedSetupStyles = makeStyles((theme) => ({
    tabContent: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
    btnWrapper: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
}));

const defaultValues = {
    caller: {
        name: "",
        phone: "",
        email: "",
    },
    pickUpLocation: null,
    sender: {
        name: "",
        phone: "",
        email: "",
    },
    receiver: {
        name: "",
        phone: "",
        email: "",
    },
    dropOffLocation: null,
    priority: "",
    items: {
        sample: 0,
        covidSample: 0,
        milk: 0,
        documents: 0,
        equipment: 0,
    },
};

const emptyTask = {
    uuid: "",
    requester_contact: {
        name: "",
        telephone_number: "",
    },
    assigned_riders: [],
    assigned_coordinators: [],
    time_picked_up: null,
    time_dropped_off: null,
    time_rejected: null,
    time_cancelled: null,
};

export const GuidedSetup = ({ show, onClose }) => {
    const history = useHistory();

    const classes = guidedSetupStyles();
    const [task, setTask] = useState(emptyTask);
    const [value, setValue] = React.useState(0);
    const [formValues, setFormValues] = useState(defaultValues);

    useEffect(() => {
        if (show) {
            const uuid = uuidv4();
            const newTask = { ...emptyTask, uuid };
            setTask(newTask);
        }
    }, [show]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleCallerContactChange = (value) => {
        const result = {
            ...formValues,
            caller: { ...formValues.caller, ...value },
        };
        setFormValues(result);
    };

    const handleSenderContactChange = (value) => {
        const result = {
            ...formValues,
            sender: { ...formValues.sender, ...value },
        };
        setFormValues(result);
    };

    const handleReceiverContactChange = (value) => {
        const result = {
            ...formValues,
            receiver: { ...formValues.receiver, ...value },
        };
        setFormValues(result);
    };

    const onPickUpLocationSaved = (pickUpLocation) => {
        const result = { ...formValues, pickUpLocation };
        const locationUUID = pickUpLocation.uuid;

        setFormValues(result);
    };

    const onSelectDropoffFromSaved = (dropOffLocation) => {
        const result = { ...formValues, dropOffLocation };
        const locationUUID = dropOffLocation.uuid;

        setFormValues(result);
    };

    let emptyDeliverable = {
        task_uuid: task.uuid,
        uuid: uuidv4(),
    };

    const onAddNewDeliverable = (deliverable) => {
        let newDeliverable = {
            ...emptyDeliverable,
            count: 1,
            type_id: deliverable.id,
            type: deliverable.label,
        };
    };

    const handleDeliverablesChange = (deliverable, count) => {
        if (deliverable.uuid) {
        } else if (deliverable.id) {
            onAddNewDeliverable(deliverable);
        }
    };

    const onShowTaskOverview = () =>
        history.push(`/task/${encodeUUID(task.uuid)}`);

    const onCloseForm = () => {
        onClose();
        setFormValues(defaultValues);
        setValue(0);
    };

    return (
        <>
            <CustomizedDialogs open={show} onClose={onCloseForm}>
                <div className={classes.tabContent}>
                    <AppBar position="static">
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            aria-label="simple tabs example"
                        >
                            <Tab label="Step 1" {...a11yProps(0)} />
                            <Tab label="Step 2" {...a11yProps(1)} />
                            <Tab label="Step 3" {...a11yProps(2)} />
                            <Tab label="Step 4" {...a11yProps(3)} />
                            <Tab label="Step 5" {...a11yProps(4)} />
                        </Tabs>
                    </AppBar>
                    <TabPanel value={value} index={0}>
                        <Step1
                            values={formValues}
                            onChange={handleCallerContactChange}
                        />
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <Step2
                            values={formValues}
                            onChange={handleSenderContactChange}
                            onSelect={onPickUpLocationSaved}
                        />
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                        <Step3
                            values={formValues}
                            onChange={handleReceiverContactChange}
                            onSelect={onSelectDropoffFromSaved}
                        />
                    </TabPanel>
                    <TabPanel value={value} index={3}>
                        <Step4 values={formValues} onChange={() => {}} />
                    </TabPanel>
                    <TabPanel value={value} index={4}>
                        <Step5
                            values={formValues}
                            taskUUID={task.uuid}
                            onChange={handleDeliverablesChange}
                        />
                    </TabPanel>
                </div>
                <div className={classes.btnWrapper}>
                    <Button
                        autoFocus
                        onClick={onShowTaskOverview}
                        color="primary"
                    >
                        Skip to overview
                    </Button>
                    <div>
                        {value > 0 && (
                            <Button
                                autoFocus
                                onClick={() => setValue((value) => value - 1)}
                                color="primary"
                            >
                                Previous
                            </Button>
                        )}
                        {value < 4 ? (
                            <Button
                                autoFocus
                                onClick={() => setValue((value) => value + 1)}
                                color="primary"
                            >
                                Next
                            </Button>
                        ) : (
                            <Button
                                autoFocus
                                onClick={() => {
                                    onShowTaskOverview();
                                    onCloseForm();
                                }}
                                color="primary"
                            >
                                Finish
                            </Button>
                        )}
                    </div>
                </div>
            </CustomizedDialogs>
        </>
    );
};

GuidedSetup.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    showPreview: PropTypes.bool,
};
