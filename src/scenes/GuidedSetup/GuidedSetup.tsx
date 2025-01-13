import React, { useState, useRef, useEffect } from "react";
import * as models from "../../models";
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
import {
    convertScheduleToTaskData,
    saveNewTaskToDataStore,
} from "./saveNewTaskToDataStore";
import {
    getWhoami,
    guidedSetupOpenSelector,
    tenantIdSelector,
} from "../../redux/Selectors";
import { showHide } from "../../styles/common";
import _ from "lodash";
import { displayErrorNotification } from "../../redux/notifications/NotificationsActions";
import { useCordovaBackButton } from "../../hooks/useCordovaBackButton";
import { Schedule } from "../sharedTaskComponents/PickUpAndDeliverSchedule";
import taskScheduleDueStatus from "../../utilities/taskScheduleDueStatus";

type TabPanelProps = {
    children: React.ReactNode;
    index: number;
    value: any;
};

const TabPanel: React.FC<TabPanelProps> = ({
    children,
    value,
    index,
    ...other
}) => {
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

const a11yProps = (index: number) => {
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

type DefaultValuesType = {
    priority: models.Priority | null;
    establishmentLocation: models.Location | null;
};

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
    visibility: models.CommentVisibility.EVERYONE,
};

const initialEstablishmentSameAsPickUpState = false;

type PickUpDropOffLocationsType = {
    pickUpLocation: models.Location | null;
    dropOffLocation: models.Location | null;
};

type DeliverablesType = {
    [key: string]: models.Deliverable;
};

export const GuidedSetup = () => {
    const { classes } = guidedSetupStyles();
    const [tabIndex, setTabIndex] = React.useState(0);
    const [formValues, setFormValues] =
        useState<DefaultValuesType>(defaultValues);
    const [establishmentSameAsPickup, setEstablishmentSameAsPickup] = useState(
        initialEstablishmentSameAsPickUpState
    );
    const tenantId = useSelector(tenantIdSelector);
    const [isPosting, setIsPosting] = useState(false);
    const [reset, setReset] = useState(false);
    const guidedSetupOpen = useSelector(guidedSetupOpenSelector);
    const deliverables = useRef<DeliverablesType>({});
    const requesterContact = useRef(defaultContact);
    const comment = useRef(defaultComment);
    const [timeOfCall, setTimeOfCall] = useState(new Date());
    const [timeOfCallInvalid, setTimeOfCallInvalid] = useState(false);
    const originalTimeOfCall = useRef<Date | null>(null);
    const dispatch = useDispatch();
    const locations = useRef<PickUpDropOffLocationsType>({
        pickUpLocation: null,
        dropOffLocation: null,
    });

    const [schedule, setSchedule] = useState<{
        pickUp: Schedule | null;
        dropOff: Schedule | null;
    }>({
        pickUp: null,
        dropOff: null,
    });

    const [pickUpOverride, setPickUpOverride] =
        useState<models.Location | null>(null);
    const { show, hide } = showHide().classes;
    const [discardConfirmationOpen, setDiscardConfirmationOpen] =
        useState(false);
    const whoami = useSelector(getWhoami);

    let isDueInOneDay = false;
    if (schedule.pickUp) {
        const convertedSchedule = convertScheduleToTaskData(schedule.pickUp);
        isDueInOneDay = !taskScheduleDueStatus(convertedSchedule, 0, 1);
    }

    const handleChange = (_: any, newValue: number) => {
        setTabIndex(newValue);
    };

    const handleCallerContactChange = (value: any) => {
        requesterContact.current = { ...requesterContact.current, ...value };
    };

    const handlePriorityChange = (value: models.Priority | null) => {
        setFormValues((prevState) => ({
            ...prevState,
            priority: value,
        }));
    };

    const handleEstablishmentChange = (value: models.Location) => {
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
        setSchedule({ pickUp: null, dropOff: null });
    }, [dispatch]);

    const handleSave = async () => {
        setIsPosting(true);
        try {
            await saveNewTaskToDataStore(
                {
                    ...formValues,
                    schedule,
                    deliverables: deliverables.current,
                    locations: locations.current,
                    requesterContact: requesterContact.current,
                    comment: comment.current,
                    timeOfCall:
                        timeOfCall?.toISOString() ||
                        originalTimeOfCall.current?.toISOString() ||
                        new Date().toISOString(),
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
            originalTimeOfCall.current !== timeOfCall ||
            !_.isEqual(formValues, defaultValues) ||
            !_.isEqual(requesterContact.current, defaultContact) ||
            !_.isEqual(comment.current.body, defaultComment.body) ||
            !_.isEmpty(deliverables.current) ||
            locations.current.pickUpLocation ||
            locations.current.dropOffLocation ||
            schedule.pickUp ||
            schedule.dropOff
        ) {
            setDiscardConfirmationOpen(true);
        } else {
            onCloseForm();
        }
    }, [
        formValues,
        timeOfCall,
        deliverables,
        locations,
        requesterContact,
        comment,
        onCloseForm,
        schedule,
    ]);

    useCordovaBackButton(handleDiscard, guidedSetupOpen);

    const handleCommentVisibilityChange = (value: models.CommentVisibility) => {
        comment.current = { ...comment.current, visibility: value };
    };

    const handleCommentChange = (value: string) => {
        comment.current = { ...comment.current, body: value };
    };

    function setLocation(
        key: keyof PickUpDropOffLocationsType,
        location: models.Location
    ) {
        locations.current[key] = location;
    }

    const handleTimeOfCallChange = (value: Date) => {
        setTimeOfCall(value);
    };

    const handleDeliverablesChange = (value: models.Deliverable) => {
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

    const handleDeliverablesDelete = (value: string) => {
        if (!value) {
            return;
        }
        deliverables.current = _.omit(deliverables.current, value);
    };

    useEffect(() => {
        if (guidedSetupOpen) {
            const newTimeOfCall = new Date();
            setTimeOfCall(newTimeOfCall);
            originalTimeOfCall.current = newTimeOfCall;
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

    const handleChangeSchedule = (newSchedule: {
        pickUp: Schedule | null;
        dropOff: Schedule | null;
    }) => {
        setSchedule(newSchedule);
    };

    return (
        <Paper
            key={reset ? "guided-setup-reset" : "guided-setup-not-reset"}
            className={classes.wrapper}
        >
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
                            data-testid="guided-setup-notes-tab"
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
                            timeOfCall={timeOfCall}
                            establishmentSameAsPickup={
                                establishmentSameAsPickup
                            }
                            onChangeContact={handleCallerContactChange}
                            onChangeLocation={handleEstablishmentChange}
                            onChangeEstablishmentSameAsPickUp={
                                handleEstablishmentSameAsPickupChange
                            }
                            onChangeTimeOfCall={handleTimeOfCallChange}
                            onInvalidTimeOfCall={(error) => {
                                if (error) setTimeOfCallInvalid(true);
                                else setTimeOfCallInvalid(false);
                            }}
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
                            onClearDropOffLocation={() => {
                                locations.current.dropOffLocation = null;
                            }}
                            onClearPickUpLocation={() => {
                                locations.current.pickUpLocation = null;
                            }}
                            onSetSchedule={handleChangeSchedule}
                            schedule={schedule}
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
                        disabled={isPosting || !timeOfCall || timeOfCallInvalid}
                        variant="contained"
                        autoFocus
                    >
                        {isDueInOneDay ? "Save to future" : "Save to dashboard"}
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
