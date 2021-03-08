import {styled} from "@material-ui/styles";
import {StyledColumn} from "../../../styles/common"
import Box from "@material-ui/core/Box";
import {withTheme} from "@material-ui/core/styles";

export const TasksKanbanColumn = styled(withTheme(Box))(props => ({
    padding: 15,
    backgroundColor: "rgba(180, 180, 180, 0.1)",
    borderRadius: 5,
    border: 0,
    boxShadow: '0 2px 3px 1px rgba(100, 100, 100, .3)',
    height: "100%",
    minHeight: "100%",
    width: "100%",
    [props.theme.breakpoints.down('sm')]: {
        padding: 5
    }
    }));

export const TasksSheetColumn = styled(StyledColumn)({
    borderRadius: 1,
    maxWidth: "1500px",
});
