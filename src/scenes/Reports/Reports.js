import React, { useState } from "react";
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
import { userRoles } from "../../apiConsts";
import { useSelector } from "react-redux";
import { getWhoami } from "../../redux/Selectors";
import UserRoleSelect from "../../components/UserRoleSelect";
import moment from "moment";

function Reports() {
    const [days, setDays] = useState("3");
    const [role, setRole] = useState(userRoles.coordinator);
    const [includeStats, setIncludeStats] = useState(false);
    const whoami = useSelector(getWhoami);
    const [isPosting, setIsPosting] = useState(false);

    const handleExport = async () => {
        setIsPosting(true);
        const timeStamp = moment().subtract(days, "days");
        const fileName = `${
            whoami.name
        }_${role}_${timeStamp}_to_${moment()}.csv`;
        generateReport(whoami.id, role, days).then((data) => {
            downloadCSVFile(data, fileName);
            setIsPosting(false);
        });
    };

    const downloadCSVFile = (data, fileName) => {
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

    // exclude roles the user does not have
    const exclude = Object.values(userRoles).filter(
        (role) => !whoami.roles.includes(role)
    );

    return (
        <PaddedPaper>
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
                    all={whoami.roles.includes(userRoles.admin)}
                    value={role}
                    onSelect={(v) => setRole(v)}
                    exclude={[userRoles.user, userRoles.admin, ...exclude]}
                />
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
                        onClick={handleExport}
                        sx={{ marginLeft: "auto", maxWidth: 100 }}
                    >
                        Export
                    </Button>
                </Box>
            </Stack>
        </PaddedPaper>
    );
}

export default Reports;
