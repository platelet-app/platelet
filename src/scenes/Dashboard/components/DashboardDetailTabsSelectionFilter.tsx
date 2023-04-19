import * as React from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import { useDispatch, useSelector } from "react-redux";
import { getRoleView } from "../../../redux/Selectors";
import { setRoleView } from "../../../redux/Actions";
import * as models from "../../../models";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const DashboardDetailTabsSelectionFilter: React.FC = () => {
    //const [personName, setPersonName] = React.useState<string[]>([]);
    const roleView = useSelector(getRoleView);
    const dispatch = useDispatch();

    const handleChange = (event: SelectChangeEvent<string[]>) => {
        const {
            target: { value },
        } = event;
        const result = typeof value === "string" ? value.split(",") : value;
        dispatch(setRoleView(result));
    };

    return (
        <div>
            <FormControl sx={{ m: 1, width: 300 }}>
                <InputLabel id="dashboard-filter">Filter</InputLabel>
                <Select
                    labelId="dashboard-filter"
                    id="dashboard-selection-filters"
                    multiple
                    value={roleView || []}
                    onChange={handleChange}
                    input={<OutlinedInput label="Tag" />}
                    renderValue={(selected) => {
                        console.log("ASDFSADF", selected);

                        return selected.join(", ");
                    }}
                    MenuProps={MenuProps}
                >
                    {[models.Role.RIDER, models.Role.COORDINATOR, "ALL"].map(
                        (role) => (
                            <MenuItem key={role} value={role}>
                                <Checkbox
                                    checked={roleView?.indexOf(role) > -1}
                                />
                                <ListItemText primary={role} />
                            </MenuItem>
                        )
                    )}
                </Select>
            </FormControl>
        </div>
    );
};

export default DashboardDetailTabsSelectionFilter;
