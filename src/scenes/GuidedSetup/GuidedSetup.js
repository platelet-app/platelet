import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";
// import { useDispatch, useSelector } from "react-redux";
import makeStyles from "@mui/styles/makeStyles";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { v4 as uuidv4 } from "uuid";

import { encodeUUID } from "../../utilities";
// import { addTaskRequest } from "../../redux/tasks/TasksActions";
// import { setTaskDropoffDestinationRequest, setTaskPickupDestinationRequest } from "../../redux/taskDestinations/TaskDestinationsActions";
// import {
//   addDeliverableRequest, updateDeliverableRequest,
// } from "../../redux/deliverables/DeliverablesActions";

import { Step1, Step2, Step3, Step4, Step5 } from './index'


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
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

const a11yProps = (index) => {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const guidedSetupStyles = makeStyles((theme) => ({
  wrapper: {
    display: "flex",
    flexDirection: "column",
    height: "100%"
  },
  tabButton: {
    borderBottom: "solid rgba(0, 0, 0, 0.55) 5px",
    color: 'black',
    opacity: 0.7,
    margin: '0 20px',
    '&:hover': {
      color: '#40a9ff',
      opacity: 1,
    },
    '&.Mui-selected': {
      fontWeight: theme.typography.fontWeightMedium,
      borderBottom: "solid rgba(0, 0, 0, 1) 5px",
      color: 'black',
    },
    '&.Mui-focusVisible': {
      backgroundColor: '#d1eaff',
    },
  },
  indicator: {
    backgroundColor: "black",
    height: "5px"
  },
  btnIcon: {
    fontSize: "2rem",
    marginBottom: "10px",
  },
  tabContent: {
    minHeight: '800px',
    backgroundColor: theme.palette.background.paper,
  },
  btnWrapper: {
    alignSelf: "end",
    display: 'flex',
    flexDirection: 'column',
  },
  btn: {
    alignSelf: "end",
    margin: '5px 5px',
    border: "1px solid #1976d2",
  },
  previousNextBtn: {
    alignSelf: "end",
  }
}));

const defaultValues = {
  caller: {
    name: "",
    phone: "",
    email: "",
  },
  pickUpLocation: null,
  pickUpTime: "",
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
  dropOffTime: "",
  priority: "",
  items: {
    sample: 0,
    covidSample: 0,
    milk: 0,
    documents: 0,
    equipment: 0,
  },
}

const emptyTask = {
  uuid: "",
  requester_contact: {
      name: "",
      telephone_number: ""
  },
  assigned_riders: [],
  assigned_coordinators: [],
  time_picked_up: null,
  time_dropped_off: null,
  time_rejected: null,
  time_cancelled: null
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
        <div className={classes.wrapper}>
            <div className={classes.tabContent}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="guided-setup-5-tabs"
                    centered
                >
                    <Tab label="Step 1" {...a11yProps(0)} className={classes.tabButton}/>
                    <Tab label="Step 2" {...a11yProps(1)} className={classes.tabButton}/>
                    <Tab label="Step 3" {...a11yProps(2)} className={classes.tabButton}/>
                    <Tab label="Step 4" {...a11yProps(3)} className={classes.tabButton}/>
                    <Tab label="Step 5" {...a11yProps(4)} className={classes.tabButton}/>
                </Tabs>
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
                    className={classes.btn}
                >
                    Skip to overview
                </Button>
                <div className={classes.previousNextBtn}>
                    {value > 0 && (
                        <Button
                            autoFocus
                            onClick={() => setValue((value) => value - 1)}
                            className={classes.btn}
                        >
                            Previous
                        </Button>
                    )}
                    {value < 4 ? (
                        <Button
                            autoFocus
                            onClick={() => setValue((value) => value + 1)}
                            className={classes.btn}
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
                            className={classes.btn}
                        >
                            Finish
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

GuidedSetup.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    showPreview: PropTypes.bool,
}
