import MenuItem from "@mui/material/MenuItem";
import { saveDashboardRoleMode } from "../../../utilities";
import * as selectionModeActions from "../../../redux/selectionMode/selectionModeActions";
import { FormControl, Select } from "@mui/material";
import { setDashboardFilteredUser, setRoleView } from "../../../redux/Actions";
import * as models from "../../../models";
import { useTheme, useMediaQuery } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
    getRoleView,
    guidedSetupOpenSelector,
    getWhoami,
} from "../../../redux/Selectors";

const RoleViewSelect = () => {
    const theme = useTheme();
    const dispatch = useDispatch();

    const isMd = useMediaQuery(theme.breakpoints.down("md"));
    const whoami = useSelector(getWhoami);
    const roleView = useSelector(getRoleView);
    const guidedSetupOpen = useSelector(guidedSetupOpenSelector);
    const clearAllSelectedItems = () => {
        dispatch(selectionModeActions.clearItems(0));
        dispatch(selectionModeActions.clearItems(1));
    };

    return (
        <FormControl variant="outlined">
            <Select
                sx={{
                    right: 5,
                    borderRadius: 2,
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "orange",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "orange",
                    },
                }}
                disabled={guidedSetupOpen}
                size="small"
                data-testId="role-menu"
                value={roleView}
            >
                {whoami.roles.includes(models.Role.COORDINATOR) && (
                    <MenuItem
                        value="ALL"
                        onClick={() => {
                            if (roleView !== "ALL") {
                                dispatch(setRoleView("ALL"));
                                saveDashboardRoleMode("ALL");
                                clearAllSelectedItems();
                            }
                        }}
                    >
                        ALL
                    </MenuItem>
                )}
                {whoami.roles.includes(models.Role.COORDINATOR) && (
                    <MenuItem
                        value={models.Role.COORDINATOR}
                        onClick={() => {
                            if (roleView !== models.Role.COORDINATOR) {
                                dispatch(setRoleView(models.Role.COORDINATOR));
                                saveDashboardRoleMode(models.Role.COORDINATOR);
                                clearAllSelectedItems();
                            }
                        }}
                    >
                        {isMd ? "COORD" : "COORDINATOR"}
                    </MenuItem>
                )}
                {whoami.roles.includes(models.Role.RIDER) && (
                    <MenuItem
                        value={models.Role.RIDER}
                        onClick={() => {
                            if (roleView !== models.Role.RIDER) {
                                dispatch(setRoleView(models.Role.RIDER));
                                dispatch(setDashboardFilteredUser(null));
                                saveDashboardRoleMode(models.Role.RIDER);
                                clearAllSelectedItems();
                            }
                        }}
                    >
                        RIDER
                    </MenuItem>
                )}
            </Select>
        </FormControl>
    );
};

export default RoleViewSelect;
