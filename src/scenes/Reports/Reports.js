import React, { useState } from "react";
import { CSVDownload } from "react-csv";
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

function Reports() {
    const [days, setDays] = useState("3");
    const [role, setRole] = useState(userRoles.coordinator);
    const [includeStats, setIncludeStats] = useState(false);
    const whoami = useSelector(getWhoami);
    const [csvData, setCsvData] = useState(null);
    const [isPosting, setIsPosting] = useState(false);

    const handleExport = async () => {
        setCsvData(null);
        setIsPosting(true);
        generateReport(whoami.id, role, days).then((data) => {
            setCsvData(data);
            setIsPosting(false);
        });
    };

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
                    all
                    value={role}
                    onSelect={(v) => setRole(v)}
                    exclude={[userRoles.user, userRoles.admin]}
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
                        onClick={handleExport}
                        sx={{ marginLeft: "auto", maxWidth: 100 }}
                    >
                        Export
                    </Button>
                </Box>
            </Stack>
            {csvData && <CSVDownload data={csvData} target="_blank" />}
        </PaddedPaper>
    );
}

export default Reports;
