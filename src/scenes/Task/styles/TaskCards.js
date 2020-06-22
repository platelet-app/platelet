import {styled} from "@material-ui/styles";
import {StyledCard} from "../../../styles/common"

export const TaskAdded = styled(StyledCard)({
    background: 'linear-gradient(0deg, rgba(250, 248, 248,1) 90%, rgba(255,255,255,1) 90%, rgba(252, 231, 121, 1) 90%, rgba(252, 231, 121, 1) 100%)',
    cursor: "pointer"
});

export const TaskNew = styled(StyledCard)({
    background: 'linear-gradient(0deg, rgba(254, 255, 245,1) 90%, rgba(255,255,255,1) 90%, rgba(252, 231, 121, 1) 90%, rgba(252, 231, 121, 1) 100%)',
    cursor: "pointer"
});

export const TaskAssigned = styled(StyledCard)({
    background: 'linear-gradient(0deg, rgba(254, 255, 245,1) 90%, rgba(255,255,255,1) 90%, cornflowerblue 90%, rgba(100,149,237,1) 100%)',
    cursor: "pointer"
});

export const TaskActive = styled(StyledCard)({
    background: 'linear-gradient(0deg, rgba(254, 255, 245,1) 90%, rgba(255,255,255,1) 90%, orange 90%, orange 100%)',
    cursor: "pointer"
});

export const TaskDelivered = styled(StyledCard)({
    background: 'linear-gradient(0deg, rgba(254, 255, 245,1) 90%, rgba(255,255,255,1) 90%, lightgreen 90%, lightgreen 100%)',
    cursor: "pointer"
});
