import React, { useEffect, useState } from "react";
import * as models from "../../models";
import {
    Button,
    Stack,
    Switch,
    FormControlLabel,
    Typography,
    Box,
    Fade,
    CircularProgress,
} from "@mui/material";
import DaysSelection from "../../components/DaysSelection";
import { PaddedPaper } from "../../styles/common";
import generateReport from "./utilities/generateReport";
import { useDispatch, useSelector } from "react-redux";
import {
    dataStoreReadyStatusSelector,
    getWhoami,
    networkStatusSelector,
} from "../../redux/Selectors";
import UserRoleSelect from "../../components/UserRoleSelect";
import moment from "moment";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import { displayErrorNotification } from "../../redux/notifications/NotificationsActions";
import CoordinatorPicker from "../../components/CoordinatorPicker";
import UserChip from "../../components/UserChip";
import RiderPicker from "../../components/RiderPicker";

function Reports() {
    const [days, setDays] = useState(3);
    const [role, setRole] = useState<models.Role>(models.Role.COORDINATOR);
    const [includeStats, setIncludeStats] = useState(false);
    const dataStoreReadyStatus = useSelector(dataStoreReadyStatusSelector);
    const networkStatus = useSelector(networkStatusSelector);
    const whoami = useSelector(getWhoami);
    const [isPosting, setIsPosting] = useState(false);
    const [confirmation, setConfirmation] = useState(false);
    const [adminSelectedUser, setAdminSelectedUser] =
        useState<models.User | null>(null);
    const dispatch = useDispatch();

    const isAdmin = whoami?.roles?.includes(models.Role.ADMIN);

    const handleExport = React.useCallback(async () => {
        try {
            const finalUser = adminSelectedUser || whoami;
            if (!finalUser || !finalUser.id) {
                throw new Error("No user selected");
            }
            setIsPosting(true);
            const timeStamp = moment().subtract(days, "days");
            const fileName = `${
                finalUser.name
            }_${role}_${timeStamp}_to_${moment()}.csv`;
            const result = await generateReport(finalUser.id, role, days);
            downloadCSVFile(result, fileName);
            setIsPosting(false);
        } catch (err) {
            console.log(err);
            dispatch(displayErrorNotification("Sorry, something went wrong."));
        }
    }, [adminSelectedUser, whoami, days, dispatch, role]);

    const handleClick = () => {
        if (!dataStoreReadyStatus && networkStatus) {
            setConfirmation(true);
        } else {
            handleExport();
        }
    };

    useEffect(() => {
        if (dataStoreReadyStatus && confirmation) {
            setConfirmation(false);
            handleExport();
        }
    }, [dataStoreReadyStatus, confirmation, handleExport]);

    const downloadCSVFile = (data: string, fileName: string) => {
        if (data) {
            const element = document.createElement("a");
            const file = new Blob([data], {
                type: "text/csv",
            });
            element.href = URL.createObjectURL(file);
            element.download = fileName || "report.csv";
            document.body.appendChild(element);
            element.click();
        }
    };

    const handleOnConfirm = () => {
        setConfirmation(false);
        handleExport();
    };

    // exclude roles the user does not have
    const exclude = Object.values(models.Role).filter(
        (role) => !whoami.roles.includes(role)
    );

    return (
        <PaddedPaper maxWidth={550}>
            <Stack sx={{ maxWidth: 400 }} direction="column" spacing={2}>
                <Typography variant="h5">Export to CSV</Typography>
                <div>
                    <DaysSelection
                        value={days}
                        onChange={(v) => {
                            setDays(v);
                        }}
                    />
                </div>
                <UserRoleSelect
                    all={whoami.roles.includes(models.Role.ADMIN)}
                    disabled={!!adminSelectedUser}
                    value={[role]}
                    onSelect={(v) => setRole(v)}
                    exclude={[models.Role.USER, models.Role.ADMIN, ...exclude]}
                />
                {isAdmin &&
                    role === models.Role.COORDINATOR &&
                    !adminSelectedUser && (
                        <CoordinatorPicker
                            onSelect={(v) => setAdminSelectedUser(v)}
                        />
                    )}
                {isAdmin &&
                    role === models.Role.RIDER &&
                    !adminSelectedUser && (
                        <RiderPicker
                            onSelect={(v) => setAdminSelectedUser(v)}
                        />
                    )}
                {adminSelectedUser && (
                    <Box>
                        <UserChip
                            user={adminSelectedUser}
                            onDelete={() => setAdminSelectedUser(null)}
                        />
                    </Box>
                )}

                {
                    // TODO: add stats
                    false && (
                        <FormControlLabel
                            sx={{ maxWidth: 180 }}
                            control={
                                <Switch
                                    onChange={(e) =>
                                        setIncludeStats(e.target.checked)
                                    }
                                    checked={includeStats}
                                />
                            }
                            label="Include stats"
                        />
                    )
                }
                <Box display="flex" justifyContent="flex-end">
                    <Fade
                        in={isPosting}
                        style={{
                            transitionDelay: isPosting ? "800ms" : "0ms",
                        }}
                        unmountOnExit
                    >
                        <CircularProgress />
                    </Fade>
                    <Button
                        disabled={isPosting}
                        aria-label="Export"
                        onClick={handleClick}
                        sx={{ marginLeft: "auto", maxWidth: 100 }}
                    >
                        Export
                    </Button>
                </Box>
            </Stack>
            <ConfirmationDialog
                open={confirmation}
                onConfirmation={handleOnConfirm}
                onCancel={() => setConfirmation(false)}
                onClose={() => setConfirmation(false)}
                dialogTitle={"Data still syncing"}
            >
                <Typography>
                    Some data may not be downloaded yet. Do you still want to
                    export?
                </Typography>
            </ConfirmationDialog>
        </PaddedPaper>
    );
}

export default Reports;
