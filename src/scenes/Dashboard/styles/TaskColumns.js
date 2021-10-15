import {styled} from "@mui/styles";
import {StyledColumn} from "../../../styles/common"
import Box from "@mui/material/Box";
import {withTheme} from "@mui/material/styles";

export const TasksKanbanColumn = styled(withTheme(Box))(props => ({
    padding: 15,
    backgroundColor: "rgba(180, 180, 180, 0.1)",
    borderRadius: 5,
    border: 0,
    boxShadow: '0 2px 3px 1px rgba(100, 100, 100, .3)',
    height: "100%",
    width: "100%",
    [props.theme.breakpoints.down('sm')]: {
        padding: 0,
    },
    [props.theme.breakpoints.up('sm')]: {
        width: 380,
    }
}));

export const TasksSheetColumn = styled(StyledColumn)({
    borderRadius: 1,
    maxWidth: "1500px",
});
