import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import makeStyles from "@mui/styles/makeStyles";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";
import { setGuidedSetupOpen } from "../../redux/Actions";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import PersonIcon from "@mui/icons-material/Person";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ArchiveIcon from "@mui/icons-material/Archive";
import NotesIcon from "@mui/icons-material/Notes";
import {
    CallerDetails,
    DeliverableDetails,
    PickUpAndDeliverDetails,
    Notes,
} from "./index";
import { Paper, Stack } from "@mui/material";
import { saveNewTaskToDataStore } from "./saveNewTaskToDataStore";
import { getWhoami } from "../../redux/Selectors";
import { commentVisibility } from "../../apiConsts";
import { showHide } from "../../styles/common";
import _ from "lodash";

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
    wrapper: {
        display: "flex",
        flexDirection: "column",
        height: "100%",
    },
    appBar: {
        boxShadow: "none",
        backgroundColor: theme.palette.background.paper,
    },
    tabs: {
        "& .MuiTabs-flexContainer": {
            justifyContent: "space-around",
        },
        //backgroundColor: "white",
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
        color: theme.palette.mode === "dark" ? "white" : "black",
        minWidth: "80px",
        borderBottom: "solid rgba(0, 0, 0, 0.55) 5px",
    },
    indicator: {
        height: "5px",
        width: "100%",
    },
    btnWrapper: {
        alignSelf: "end",
        display: "flex",
        flexDirection: "column",
    },
    btnIcon: {
        fontSize: "2rem",
        marginBottom: "10px",
        color: theme.palette.mode === "dark" ? "white" : "black",
    },
    tabContent: {
        maxHeight: 1100,
        flexGrow: 1,
        overflowY: "auto",
    },
}));

const defaultValues = {
    pickUpLocation: null,
    pickUpTime: null,
    dropOffLocation: null,
    dropOffTime: null,
    priority: null,
};

export const GuidedSetup = ({ onClose }) => {
    const classes = guidedSetupStyles();
    const [tabIndex, setTabIndex] = React.useState(0);
    const [formValues, setFormValues] = useState(defaultValues);
    const [reset, setReset] = useState(false);
    const deliverables = useRef({});
    const requesterContact = useRef({
        name: "",
        telephoneNumber: "",
        email: "",
    });
    const comment = useRef({
        visibility: commentVisibility.everyone,
        body: "",
    });
    const timeOfCall = useRef(new Date().toISOString());
    const dispatch = useDispatch();
    const { show, hide } = showHide();
    const [discardConfirmationOpen, setDiscardConfirmationOpen] =
        useState(false);
    const whoami = useSelector(getWhoami);

    const handleChange = (event, newValue) => {
        setTabIndex(newValue);
    };

    const handleCallerContactChange = (value) => {
        requesterContact.current = { ...requesterContact.current, ...value };
    };

    const handlePriorityChange = (value) => {
        setFormValues((prevState) => ({
            ...prevState,
            priority: value,
        }));
    };

    const handleSenderContactChange = (value) => {
        setFormValues((prevState) => ({
            ...prevState,
            sender: { ...prevState.sender, ...value },
        }));
    };

    const handleReceiverContactChange = (value) => {
        setFormValues((prevState) => ({
            ...prevState,
            receiver: { ...prevState.receiver, ...value },
        }));
    };

    const handleSave = async () => {
        await saveNewTaskToDataStore(
            {
                ...formValues,
                deliverables: deliverables.current,
                requesterContact: requesterContact.current,
                comment: comment.current,
                timeOfCall: timeOfCall.current,
            },
            whoami.id
        );
        onCloseForm();
    };

    const handleDiscard = () => {
        if (_.isEqual(formValues, defaultValues)) {
            onCloseForm();
        } else {
            setDiscardConfirmationOpen(true);
        }
    };

    const handleCommentVisibilityChange = (value) => {
        comment.current = { ...comment.current, visibility: value };
    };

    const handleCommentChange = (value) => {
        comment.current = { ...comment.current, body: value };
    };

    const onPickUpLocationSaved = (pickUpLocation) => {
        setFormValues((prevState) => ({ ...prevState, pickUpLocation }));
    };

    const onDropOffLocationSaved = (dropOffLocation) => {
        setFormValues((prevState) => ({ ...prevState, dropOffLocation }));
    };

    const handleDeliverablesChange = (value) => {
        if (!value || !value.id) {
            return;
        }
        if (deliverables.current[value.id]) {
            deliverables.current = {
                ...deliverables.current,
                [value.id]: {
                    ...deliverables.current[value.id],
                    ...value,
                },
            };
        } else {
            deliverables.current = {
                ...deliverables.current,
                [value.id]: value,
            };
        }
    };

    const handleDeliverablesDelete = (value) => {
        if (!value) {
            return;
        }
        deliverables.current = _.omit(deliverables.current, value);
    };

    const onCloseForm = () => {
        setFormValues(defaultValues);
        setTabIndex(0);
        dispatch(setGuidedSetupOpen(false));
        // force rerender so that all the tabs are reset
        setReset((prevState) => !prevState);
    };

    return (
        <Paper key={reset} className={classes.wrapper}>
            <div className={classes.tabContent}>
                <AppBar position="static" className={classes.appBar}>
                    <Tabs
                        value={tabIndex}
                        onChange={handleChange}
                        aria-label="coordinator setup tab"
                        className={classes.tabs}
                        classes={{
                            indicator: classes.indicator,
                        }}
                    >
                        <Tab
                            icon={<PersonIcon className={classes.btnIcon} />}
                            label={
                                <div>
                                    Caller /<br /> Priority
                                </div>
                            }
                            {...a11yProps(0)}
                            className={classes.tabButton}
                        />
                        <Tab
                            icon={<ArchiveIcon className={classes.btnIcon} />}
                            label={"Items"}
                            {...a11yProps(1)}
                            className={classes.tabButton}
                        />
                        <Tab
                            icon={
                                <LocationOnIcon className={classes.btnIcon} />
                            }
                            label={
                                <div>
                                    Pick-up /<br /> Delivery
                                </div>
                            }
                            {...a11yProps(2)}
                            className={classes.tabButton}
                        />
                        <Tab
                            icon={<NotesIcon className={classes.btnIcon} />}
                            label={"Notes"}
                            {...a11yProps(3)}
                            className={classes.tabButton}
                        />
                        {/* <Tab label="Step 5" {...a11yProps(4)} className={classes.tabButton} /> */}
                    </Tabs>
                </AppBar>
                <Box sx={{ padding: 1 }}>
                    <Box className={tabIndex === 0 ? show : hide}>
                        <CallerDetails
                            values={formValues}
                            onChangeContact={handleCallerContactChange}
                            onChangePriority={handlePriorityChange}
                        />
                    </Box>
                    <Box className={tabIndex === 1 ? show : hide}>
                        <DeliverableDetails
                            onChange={handleDeliverablesChange}
                            onDelete={handleDeliverablesDelete}
                        />
                    </Box>
                    <Box className={tabIndex === 2 ? show : hide}>
                        <PickUpAndDeliverDetails
                            values={formValues}
                            onChange={handleReceiverContactChange}
                            onSelectPickupLocation={onPickUpLocationSaved}
                            onSelectDropOffLocation={onDropOffLocationSaved}
                        />
                    </Box>
                    <Box className={tabIndex === 3 ? show : hide}>
                        <Notes
                            handleVisibilityChange={
                                handleCommentVisibilityChange
                            }
                            onChange={handleCommentChange}
                        />
                    </Box>
                </Box>
            </div>
            <Stack direction="column">
                <Stack
                    sx={{ margin: 1 }}
                    justifyContent="space-between"
                    direction="row"
                >
                    {tabIndex !== 0 ? (
                        <Button
                            onClick={() =>
                                setTabIndex((prevState) => prevState - 1)
                            }
                        >
                            Previous
                        </Button>
                    ) : (
                        <div></div>
                    )}
                    {tabIndex !== 3 ? (
                        <Button
                            onClick={() =>
                                setTabIndex((prevState) => prevState + 1)
                            }
                        >
                            Next
                        </Button>
                    ) : (
                        <div></div>
                    )}
                </Stack>
                <Stack
                    sx={{ margin: 1 }}
                    justifyContent="space-between"
                    direction="row"
                >
                    <Button onClick={handleDiscard}>Discard</Button>
                    <Button onClick={handleSave} variant="contained" autoFocus>
                        Save to dashboard
                    </Button>
                </Stack>
            </Stack>
            <ConfirmationDialog
                open={discardConfirmationOpen}
                dialogTitle={"Are you sure?"}
                onClose={() => setDiscardConfirmationOpen(false)}
                onConfirmation={onCloseForm}
            >
                <Typography>
                    This will clear any data you have entered.
                </Typography>
            </ConfirmationDialog>
        </Paper>
    );
};

GuidedSetup.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    showPreview: PropTypes.bool,
};
