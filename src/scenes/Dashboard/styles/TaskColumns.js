import {styled} from "@material-ui/styles";
import {StyledColumn} from "../../../styles/common"

export const TasksKanbanColumn = styled(StyledColumn)({
    maxWidth: "600px",
    minWidth: "350px",
    backgroundColor: "rgba(180, 180, 180, 0.1)",
    borderRadius: 5,
});

export const TasksSheetColumn = styled(StyledColumn)({
    borderRadius: 1,
    maxWidth: "1500px",
});

