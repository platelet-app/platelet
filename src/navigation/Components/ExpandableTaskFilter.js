import React, { useState } from "react";
import TaskFilterTextField from "../../components/TaskFilterTextfield";
import { showHide } from "../../styles/common";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";

function ExpandableTaskFilter() {
    const [open, setOpen] = useState(false);
    const { show, hide } = showHide().classes;
    return (
        <div>
            <IconButton
                className={open ? hide : show}
                onClick={() => setOpen(true)}
                size="large"
            >
                <SearchIcon />
            </IconButton>
            <TaskFilterTextField className={open ? show : hide} />
        </div>
    );
}

export default ExpandableTaskFilter;
