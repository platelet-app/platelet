import React, { useRef, useState } from "react";
import { CSVLink, CSVDownload } from "react-csv";
import { Button, Stack } from "@mui/material";
import DaysSelection from "../../components/DaysSelection";
import { PaddedPaper } from "../../styles/common";
import generateReport from "./utilities/generateReport";
import { userRoles } from "../../apiConsts";
import { useSelector } from "react-redux";
import { getWhoami } from "../../redux/Selectors";

function Reports() {
    const [days, setDays] = useState("1");
    const whoami = useSelector(getWhoami);
    const [csvData, setCsvData] = useState(null);

    const handleExport = async () => {
        setCsvData(null);
        generateReport(whoami.id, userRoles.coordinator, days).then((data) => {
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
                <Button onClick={handleExport} sx={{ maxWidth: 100 }}>
                    Export
                </Button>
            </Stack>
            {csvData && <CSVDownload data={csvData} target="_blank" />}
        </PaddedPaper>
    );
}

export default Reports;
