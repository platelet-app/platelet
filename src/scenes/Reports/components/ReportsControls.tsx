import React from "react";
import { useTheme } from "@mui/material/styles";
import {
    Box,
    Grid,
    IconButton,
    Stack,
    TextField,
    useMediaQuery,
} from "@mui/material";
import DaysSelection, { Days } from "../../../components/DaysSelection";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { DateRangePicker, DateRange } from "@mui/lab";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import UserRoleSelect from "../../../components/UserRoleSelect";
import CoordinatorPicker from "../../../components/CoordinatorPicker";
import UserChip from "../../../components/UserChip";
import RiderPicker from "../../../components/RiderPicker";
import * as models from "../../../models";
import { useSelector } from "react-redux";
import { getWhoami } from "../../../redux/Selectors";

type ReportsControlsProps = {
    isFetching: boolean;
    adminSelectedUser: models.User | null;
    role: models.Role | "ALL";
    days: Days | null;
    onChangeDateRange(startDate: Date | null, endDate: Date | null): void;
    onChangeAdminSelectedUser(user: models.User | null): void;
    onChangeRole(role: models.Role | "ALL"): void;
    onChangeDays(days: Days): void;
};

const ReportsControls: React.FC<ReportsControlsProps> = ({
    isFetching,
    adminSelectedUser,
    role,
    days,
    onChangeDateRange,
    onChangeAdminSelectedUser,
    onChangeRole,
    onChangeDays,
}) => {
    const [customDaysRange, setCustomDaysRange] = React.useState<
        DateRange<Date>
    >([new Date(), new Date()]);
    const whoami = useSelector(getWhoami);
    const isAdmin = whoami?.roles?.includes(models.Role.ADMIN);

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

    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down("sm"));

    const customRange = days === Days.CUSTOM;

    // exclude roles the user does not have
    const exclude = Object.values(models.Role).filter(
        (role) => !whoami.roles.includes(role)
    );

    const excludeDays = role !== "ALL" ? [Days.CUSTOM, Days.TWO_WEEKS] : [];
    return (
        <Stack spacing={1}>
            <Grid container spacing={1}>
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
                        startText="From"
                        inputFormat="dd/MM/yyyy"
                        endText="To"
                        value={customDaysRange}
                        onChange={handleDateChange}
                        renderInput={(startProps, endProps) => (
                            <Stack spacing={1} direction="row">
                                <TextField
                                    {...startProps}
                                    size="small"
                                    inputProps={{
                                        ...startProps.inputProps,
                                        "aria-label": "Start date",
                                    }}
                                />
                                <TextField
                                    {...endProps}
                                    size="small"
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

            {isFetching && <LoadingSpinner delay={800} progress={0} />}
        </Stack>
    );
};

export default ReportsControls;
