import React, {useState} from "react";
import TaskFilterTextField from "../../components/TaskFilterTextfield";
import {showHide} from "../../styles/common";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@material-ui/core/IconButton";

function ExpandableTaskFilter(props) {
    const [open, setOpen] = useState(false);
    const {show, hide} = showHide();
    return (
        <div>
            <IconButton className={open ? hide : show} onClick={() => setOpen(true)}>
                <SearchIcon/>
            </IconButton>
            <TaskFilterTextField className={open ? show : hide}/>
        </div>
    )
}

export default ExpandableTaskFilter;
