import React from "react";
import { Box, Grid, IconButton, Stack, TextField } from "@mui/material";
import DaysSelection, { Days } from "../../../components/DaysSelection";
import { DateRangePicker, DateRange } from "@mui/lab";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import UserRoleSelect from "../../../components/UserRoleSelect";
import CoordinatorPicker from "../../../components/CoordinatorPicker";
import UserChip from "../../../components/UserChip";
import RiderPicker from "../../../components/RiderPicker";
import * as models from "../../../models";
import { useSelector } from "react-redux";
import { getWhoami } from "../../../redux/Selectors";
import { DateRangeValidationError } from "@mui/lab/internal/pickers/date-utils";

type ReportsControlsProps = {
    adminSelectedUser: models.User | null;
    role: models.Role | "ALL";
    days: Days | null;
    onChangeDateRange(startDate: Date | null, endDate: Date | null): void;
    onChangeAdminSelectedUser(user: models.User | null): void;
    onChangeRole(role: models.Role | "ALL"): void;
    onChangeDays(days: Days): void;
    onErrorState(error: boolean): void;
};

const ReportsControls: React.FC<ReportsControlsProps> = ({
    adminSelectedUser,
    role,
    days,
    onChangeDateRange,
    onChangeAdminSelectedUser,
    onChangeRole,
    onChangeDays,
    onErrorState,
}) => {
    const [customDaysRange, setCustomDaysRange] = React.useState<
        DateRange<Date>
    >([new Date(), new Date()]);
    const [dateError, setDateError] =
        React.useState<DateRangeValidationError | null>(null);
    const whoami = useSelector(getWhoami);
    const isAdmin = whoami?.roles?.includes(models.Role.ADMIN);

    const getMaxDate = React.useCallback(() => {
        if (customDaysRange[0]) {
            const maxDate = new Date(customDaysRange[0]);
            maxDate.setMonth(customDaysRange[0].getMonth() + 3);
            return maxDate;
        }
    }, [customDaysRange]);

    const handleChangeDays = (newDays: Days) => {
        if (newDays === Days.CUSTOM) {
            onChangeDays(newDays);
            setCustomDaysRange([new Date(), new Date()]);
            onChangeDateRange(new Date(), new Date());
        } else {
            onChangeDays(newDays);
            onChangeDateRange(null, null);
        }
    };

    const handleDateChange = (newDateRange: DateRange<Date>) => {
        setCustomDaysRange(newDateRange);
        if (newDateRange[0] && newDateRange[1]) {
            onChangeDateRange(newDateRange[0], newDateRange[1]);
        }
    };

    const customRange = days === Days.CUSTOM;

    // exclude roles the user does not have
    const exclude = isAdmin
        ? []
        : Object.values(models.Role).filter(
              (role) => !whoami.roles.includes(role)
          );
    const errorMessage = (error: string | null | undefined) => {
        switch (error) {
            case "maxDate":
            case "minDate": {
                return "Please select a range of 3 months or less";
            }
            case "invalidDate": {
                return "Your date is not valid";
            }
            default: {
                return "";
            }
        }
    };

    const handleCustomRangeError = (error: DateRangeValidationError) => {
        if (error[0] || error[1]) {
            onErrorState(true);
            setDateError(error);
        } else {
            onErrorState(false);
            setDateError(null);
        }
    };

    const excludeDays = role !== "ALL" ? [Days.CUSTOM, Days.TWO_WEEKS] : [];
    return (
        <Stack spacing={1}>
            <Grid direction="column" container spacing={1}>
                <Grid item>
                    <UserRoleSelect
                        all={isAdmin}
                        disabled={!!adminSelectedUser}
                        value={[role]}
                        onSelect={onChangeRole}
                        exclude={[
                            models.Role.USER,
                            models.Role.ADMIN,
                            ...exclude,
                        ]}
                    />
                </Grid>
                <Grid item>
                    {!customRange && (
                        <DaysSelection
                            exclude={excludeDays}
                            value={days}
                            onChange={handleChangeDays}
                            showCustom={isAdmin && !adminSelectedUser}
                        />
                    )}
                </Grid>
            </Grid>
            {customRange && (
                <Stack direction="row">
                    <DateRangePicker
                        disableFuture
                        startText="From"
                        maxDate={getMaxDate()}
                        onError={handleCustomRangeError}
                        inputFormat="dd/MM/yyyy"
                        endText="To"
                        value={customDaysRange}
                        onChange={handleDateChange}
                        renderInput={(startProps, endProps) => (
                            <Stack spacing={1} direction="row">
                                <TextField
                                    {...startProps}
                                    size="small"
                                    helperText={errorMessage(dateError?.[0])}
                                    inputProps={{
                                        ...startProps.inputProps,
                                        "aria-label": "Start date",
                                    }}
                                />
                                <TextField
                                    {...endProps}
                                    size="small"
                                    helperText={errorMessage(dateError?.[1])}
                                    inputProps={{
                                        ...endProps.inputProps,
                                        "aria-label": "End date",
                                    }}
                                />
                            </Stack>
                        )}
                    />
                    <IconButton
                        aria-label="back to days selection"
                        onClick={() => {
                            handleChangeDays(Days.THREE_DAYS);
                        }}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                </Stack>
            )}
            {isAdmin &&
                role === models.Role.COORDINATOR &&
                !adminSelectedUser && (
                    <CoordinatorPicker onSelect={onChangeAdminSelectedUser} />
                )}
            {isAdmin && role === models.Role.RIDER && !adminSelectedUser && (
                <RiderPicker onSelect={onChangeAdminSelectedUser} />
            )}
            {adminSelectedUser && (
                <Box>
                    <UserChip
                        user={adminSelectedUser}
                        onDelete={() => onChangeAdminSelectedUser(null)}
                    />
                </Box>
            )}
        </Stack>
    );
};

export default ReportsControls;
