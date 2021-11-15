import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import makeStyles from '@mui/styles/makeStyles';
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { v4 as uuidv4 } from "uuid";

import PersonIcon from '@mui/icons-material/Person';

import { encodeUUID } from "../../utilities";
import { addTaskRequest } from "../../redux/tasks/TasksActions";
import { setTaskDropoffDestinationRequest, setTaskPickupDestinationRequest } from "../../redux/taskDestinations/TaskDestinationsActions";
import {
  addDeliverableRequest, updateDeliverableRequest,
} from "../../redux/deliverables/DeliverablesActions";

import { CustomizedDialogs } from '../../components/CustomizedDialogs'
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
  appBar: {
    boxShadow: "none",
  },
  tabs: {
    "& .MuiTabs-flexContainer": {
      justifyContent: "space-around"
    },
    backgroundColor: "white"
  },
  tabButton: {
    "& .MuiTab-wrapper": {
      justifyContent: "flex-start",
      height: "100%",
    },
    display: "grid",
    justifyItems: "center",
    alignItems: "self-start",
    gridTemplateRows: "45px 1fr",
    color: "black",
    minWidth: "80px",
    borderBottom: "solid rgba(0, 0, 0, 0.55) 5px",
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
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  btn: {
    position: "absolute",
    height: "60px",
    width: "220px",
    right: "25px",
    bottom: "8%",
    border: "1px solid #1976d2",
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
  const [task, setTask] = useState(emptyTask)
  const [value, setValue] = React.useState(0);
  const [formValues, setFormValues] = useState(defaultValues)
  const roleView = useSelector(state => state.roleView);
  const whoami = useSelector(state => state.whoami.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if(show) {
      const uuid = uuidv4();
      const newTask = {...emptyTask, uuid}
      setTask(newTask)

      dispatch(addTaskRequest({
        ...newTask,
        time_of_call: new Date().toISOString(),
        time_created: new Date().toISOString()
      }, roleView, whoami.uuid))
    }
    
  }, [show])

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleCallerContactChange = (value) => {
    const result = {...formValues, caller: {...formValues.caller, ...value}}
    setFormValues(result)
  }

  const handleSenderContactChange = (value) => {
    const result = {...formValues, sender: {...formValues.sender, ...value}}
    setFormValues(result)
  }

  const handleReceiverContactChange = (value) => {
    const result = {...formValues, receiver: {...formValues.receiver, ...value}}
    setFormValues(result)
  }

  const onPickUpTimeSaved = (pickUpTime) => {
    const result = {...formValues, pickUpTime}

    setFormValues(result)
  }

  const onDropOffTimeSaved = (dropOffTime) => {
    const result = {...formValues, dropOffTime}

    setFormValues(result)
  }
  
  const onPickUpLocationSaved = (pickUpLocation) => {
    const result = {...formValues, pickUpLocation}
    const locationUUID = pickUpLocation.uuid;

    setFormValues(result)

    if (locationUUID) {
        dispatch(setTaskPickupDestinationRequest(task.uuid, locationUUID))
    }
}

  const onDropoffLocationSaved = (dropOffLocation) => {
    const result = {...formValues, dropOffLocation}
    const locationUUID = dropOffLocation.uuid;

    setFormValues(result)
    if (locationUUID) {
        dispatch(setTaskDropoffDestinationRequest(task.uuid, locationUUID))
    }
  }

  let emptyDeliverable = {
    task_uuid: task.uuid,
    uuid: uuidv4()
  };

  const onAddNewDeliverable = (deliverable) => {
    let newDeliverable = {...emptyDeliverable, count: 1, type_id: deliverable.id, type: deliverable.label};
    dispatch(addDeliverableRequest(newDeliverable));
};

  const handleDeliverablesChange = (deliverable, count) => {
    if (deliverable.uuid) {
        dispatch(updateDeliverableRequest(deliverable.uuid, {count}));
    } else if (deliverable.id) {
        onAddNewDeliverable(deliverable);
    }
  }

  const onShowTaskOverview = () => history.push(`/task/${encodeUUID(task.uuid)}`);
  
  const onCloseForm = () => {
    onClose()
    setFormValues(defaultValues)
    setValue(0)
  }
  
  return (
    <div className={classes.wrapper} open={show} onClose={onCloseForm} >
        <div className={classes.tabContent}>
          <AppBar position="static" className={classes.appBar}>
              <Tabs 
                value={value} 
                onChange={handleChange} 
                aria-label="coordianator setup tab" 
                className={classes.tabs}
                classes={{
                  indicator: classes.indicator
                }}
              >
                  <Tab icon={<PersonIcon className={classes.btnIcon} />} label="Caller" {...a11yProps(0)} className={classes.tabButton} />
                  <Tab icon={<PersonIcon className={classes.btnIcon} />} label={<div>{`Items &`} <br /> {`Priority`}</div>} {...a11yProps(1)} className={classes.tabButton} />
                  <Tab icon={<PersonIcon className={classes.btnIcon} />} label={<div>Pick-up <br /> Drop-off</div>} {...a11yProps(2)} className={classes.tabButton} />
                  <Tab icon={<PersonIcon className={classes.btnIcon} />} label={<div>Assign <br /> Rider/Van</div>} {...a11yProps(3)} className={classes.tabButton} />
                  {/* <Tab label="Step 5" {...a11yProps(4)} className={classes.tabButton} /> */}
              </Tabs>
          </AppBar>
          <TabPanel value={value} index={0}>
              <Step1 values={formValues} onChange={handleCallerContactChange} />
          </TabPanel>
          <TabPanel value={value} index={1}>
              <Step2 
                values={formValues} 
                // onSelect={onPickUpLocationSaved}
                taskUUID={task.uuid} 
                onChange={handleDeliverablesChange} />
          </TabPanel>
          <TabPanel value={value} index={2}>
              <Step3 
                values={formValues} 
                onChange={handleReceiverContactChange}
                onSelectDropoffLocation={onDropoffLocationSaved}
                onSelectDropoffTime={onDropOffTimeSaved}
                onSelectPickupLocation={onPickUpLocationSaved}
                onSelectPickupTime={onPickUpTimeSaved} />
          </TabPanel>
          <TabPanel value={value} index={3}>
              <Step4 values={formValues} onChange={() => {}} />
          </TabPanel>
          <TabPanel value={value} index={4}>
              <Step5 values={formValues} taskUUID={task.uuid} onChange={handleDeliverablesChange} />
          </TabPanel>
        </div>
        <Button className={classes.btn} autoFocus onClick={onShowTaskOverview} color="primary">
          Skip to detailed overview
        </Button>
    </div>
  );
}

GuidedSetup.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    showPreview: PropTypes.bool,
}
