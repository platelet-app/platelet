import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "tss-react/mui";
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
    NotesAndPriority,
} from "./index";
import { Paper, Stack } from "@mui/material";
import { saveNewTaskToDataStore } from "./saveNewTaskToDataStore";
import {
    getWhoami,
    guidedSetupOpenSelector,
    tenantIdSelector,
} from "../../redux/Selectors";
import { commentVisibility } from "../../apiConsts";
import { showHide } from "../../styles/common";
import _ from "lodash";
import { displayErrorNotification } from "../../redux/notifications/NotificationsActions";
import { useCordovaBackButton } from "../../hooks/useCordovaBackButton";

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

const guidedSetupStyles = makeStyles()((theme) => ({
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
        maxHeight: 1010,
        flexGrow: 1,
        overflowY: "auto",
    },
}));

const defaultValues = {
    priority: null,
    establishmentLocation: null,
};

const defaultContact = {
    name: "",
    telephoneNumber: "",
};

const defaultComment = {
    body: "",
    visibility: commentVisibility.everyone,
};

const initialEstablishmentSameAsPickUpState = false;

export const GuidedSetup = () => {
    const { classes } = guidedSetupStyles();
    const [tabIndex, setTabIndex] = React.useState(0);
    const [formValues, setFormValues] = useState(defaultValues);
    const [establishmentSameAsPickup, setEstablishmentSameAsPickup] = useState(
        initialEstablishmentSameAsPickUpState
    );
    const tenantId = useSelector(tenantIdSelector);
    const [isPosting, setIsPosting] = useState(false);
    const [reset, setReset] = useState(false);
    const guidedSetupOpen = useSelector(guidedSetupOpenSelector);
    const deliverables = useRef({});
    const requesterContact = useRef(defaultContact);
    const comment = useRef(defaultComment);
    const timeOfCall = useRef(new Date().toISOString());
    const dispatch = useDispatch();
    const locations = useRef({ pickUpLocation: null, dropOffLocation: null });
    const [pickUpOverride, setPickUpOverride] = useState(null);
    const { show, hide } = showHide().classes;
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

    const handleEstablishmentChange = (value) => {
        setFormValues((prevState) => ({
            ...prevState,
            establishmentLocation: value,
        }));
    };

    useEffect(() => {
        if (
            establishmentSameAsPickup &&
            formValues.establishmentLocation &&
            formValues.establishmentLocation.listed === 1
        ) {
            setLocation("pickUpLocation", formValues.establishmentLocation);
            setPickUpOverride(formValues.establishmentLocation);
        } else {
            setPickUpOverride(null);
        }
    }, [establishmentSameAsPickup, formValues.establishmentLocation]);

    const handleEstablishmentSameAsPickupChange = () => {
        setEstablishmentSameAsPickup((prevState) => !prevState);
    };

    const onCloseForm = React.useCallback(() => {
        dispatch(setGuidedSetupOpen(false));
        setEstablishmentSameAsPickup(initialEstablishmentSameAsPickUpState);
        setTabIndex(0);
    }, [dispatch]);

    const handleSave = async () => {
        setIsPosting(true);
        try {
            await saveNewTaskToDataStore(
                {
                    ...formValues,
                    deliverables: deliverables.current,
                    locations: locations.current,
                    requesterContact: requesterContact.current,
                    comment: comment.current,
                    timeOfCall: timeOfCall.current,
                },
                tenantId,
                whoami && whoami.id
            );
            setEstablishmentSameAsPickup(initialEstablishmentSameAsPickUpState);
        } catch (e) {
            console.error(e);
            dispatch(displayErrorNotification("Sorry, something went wrong"));
            setIsPosting(false);
            setEstablishmentSameAsPickup(initialEstablishmentSameAsPickUpState);
            return;
        }
        setIsPosting(false);
        setDiscardConfirmationOpen(false);
        onCloseForm();
    };

    const handleDiscard = React.useCallback(() => {
        if (
            !_.isEqual(formValues, defaultValues) ||
            !_.isEqual(requesterContact.current, defaultContact) ||
            !_.isEqual(comment.current.body, defaultComment.body) ||
            !_.isEmpty(deliverables.current) ||
            locations.current.pickUpLocation ||
            locations.current.dropOffLocation
        ) {
            setDiscardConfirmationOpen(true);
        } else {
            onCloseForm();
        }
    }, [
        formValues,
        deliverables,
        locations,
        requesterContact,
        comment,
        onCloseForm,
    ]);

    useCordovaBackButton(handleDiscard, guidedSetupOpen);

    const handleCommentVisibilityChange = (value) => {
        comment.current = { ...comment.current, visibility: value };
    };

    const handleCommentChange = (value) => {
        comment.current = { ...comment.current, body: value };
    };

    function setLocation(key, location) {
        locations.current[key] = location;
    }

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

    useEffect(() => {
        if (guidedSetupOpen) {
            timeOfCall.current = new Date().toISOString();
        } else {
            setFormValues(defaultValues);
            deliverables.current = {};
            requesterContact.current = defaultContact;
            comment.current = defaultComment;
            locations.current = { pickUpLocation: null, dropOffLocation: null };
            // force rerender so that all the tabs are reset
            setReset((prevState) => !prevState);
        }
    }, [guidedSetupOpen]);

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
                            label={"CALLER"}
                            {...a11yProps(0)}
                            className={classes.tabButton}
                        />
                        <Tab
                            icon={
                                <LocationOnIcon className={classes.btnIcon} />
                            }
                            label={
                                <div>
                                    PICK-UP /<br /> DELIVERY
                                </div>
                            }
                            {...a11yProps(2)}
                            className={classes.tabButton}
                        />
                        <Tab
                            icon={<ArchiveIcon className={classes.btnIcon} />}
                            label={"ITEMS"}
                            {...a11yProps(1)}
                            className={classes.tabButton}
                        />
                        <Tab
                            icon={<NotesIcon className={classes.btnIcon} />}
                            label={
                                <div>
                                    NOTES /<br /> PRIORITY
                                </div>
                            }
                            {...a11yProps(3)}
                            className={classes.tabButton}
                        />
                    </Tabs>
                </AppBar>
                <Box sx={{ padding: 1 }}>
                    <Box className={tabIndex === 0 ? show : hide}>
                        <CallerDetails
                            values={formValues}
                            establishmentSameAsPickup={
                                establishmentSameAsPickup
                            }
                            onChangeContact={handleCallerContactChange}
                            onChangeLocation={handleEstablishmentChange}
                            onChangeEstablishmentSameAsPickUp={
                                handleEstablishmentSameAsPickupChange
                            }
                        />
                    </Box>
                    <Box className={tabIndex === 1 ? show : hide}>
                        <PickUpAndDeliverDetails
                            overrides={{
                                pickUpLocation: pickUpOverride,
                            }}
                            onSetPickUpLocation={(value) => {
                                setLocation("pickUpLocation", value);
                            }}
                            onSetDropOffLocation={(value) => {
                                setLocation("dropOffLocation", value);
                            }}
                            onClearDropOffLocation={() =>
                                (locations.current.dropOffLocation = null)
                            }
                            onClearPickUpLocation={() =>
                                (locations.current.pickUpLocation = null)
                            }
                        />
                    </Box>
                    <Box className={tabIndex === 2 ? show : hide}>
                        <DeliverableDetails
                            onChange={handleDeliverablesChange}
                            onDelete={handleDeliverablesDelete}
                        />
                    </Box>
                    <Box className={tabIndex === 3 ? show : hide}>
                        <NotesAndPriority
                            priority={formValues.priority}
                            handleVisibilityChange={
                                handleCommentVisibilityChange
                            }
                            onChange={handleCommentChange}
                            onChangePriority={handlePriorityChange}
                        />
                    </Box>
                </Box>
            </div>
            <Stack spacing={2} direction="column">
                <Stack
                    sx={{ padding: 1 }}
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
                    sx={{ padding: 1 }}
                    justifyContent="space-between"
                    direction="row"
                >
                    <Button onClick={handleDiscard} disabled={isPosting}>
                        Discard
                    </Button>
                    <Button
                        data-cy="save-to-dash-button"
                        onClick={handleSave}
                        disabled={isPosting}
                        variant="contained"
                        autoFocus
                    >
                        Save to dashboard
                    </Button>
                </Stack>
            </Stack>
            <ConfirmationDialog
                open={discardConfirmationOpen}
                dialogTitle={"Are you sure?"}
                onClose={() => setDiscardConfirmationOpen(false)}
                onCancel={() => setDiscardConfirmationOpen(false)}
                onConfirmation={() => {
                    setDiscardConfirmationOpen(false);
                    onCloseForm();
                }}
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
