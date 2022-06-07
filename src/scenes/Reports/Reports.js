import React, { useState } from "react";
import { CSVDownload } from "react-csv";
import { Button, Stack } from "@mui/material";
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
    const whoami = useSelector(getWhoami);
    const [csvData, setCsvData] = useState(null);

    const handleExport = async () => {
        setCsvData(null);
        generateReport(whoami.id, role, days).then((data) => {
            setCsvData(data);
        });
    };
    return (
        <PaddedPaper>
            <Stack direction="column" spacing={2}>
                <DaysSelection
                    value={days}
                    onChange={(v) => {
                        setDays(v);
                    }}
                />
                <UserRoleSelect
                    all
                    value={role}
                    onSelect={(v) => setRole(v)}
                    exclude={[userRoles.user, userRoles.admin]}
                />
                <Button onClick={handleExport} sx={{ maxWidth: 100 }}>
                    Export
                </Button>
            </Stack>
            {csvData && <CSVDownload data={csvData} target="_blank" />}
        </PaddedPaper>
    );
}

export default Reports;
