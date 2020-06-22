import {styled} from "@material-ui/styles";
import {StyledStrip} from "../../../styles/common";

export const TaskAdded = styled(StyledStrip)({
    background: 'linear-gradient(0deg, rgba(250, 248, 248,1) 90%, rgba(255,255,255,1) 90%, rgba(252, 231, 121, 1) 90%, rgba(252, 231, 121, 1) 100%)',
    paddingLeft: "20px"
});

export const TaskNew = styled(StyledStrip)({
    background: 'linear-gradient(270deg, rgba(254, 255, 245,1) 98%, rgba(255,255,255,1) 95%, rgba(252, 231, 121, 1) 95%, rgba(252, 231, 121, 1) 100%)',
    paddingLeft: "20px"
});

export const TaskAssigned = styled(StyledStrip)({
    background: 'linear-gradient(270deg, rgba(254, 255, 245,1) 98%, rgba(255,255,255,1) 98%, cornflowerblue 98%, rgba(100,149,237,1) 100%)',
    paddingLeft: "20px"
});

export const TaskActive = styled(StyledStrip)({
    background: 'linear-gradient(270deg, rgba(254, 255, 245,1) 98%, rgba(255,255,255,1) 98%, orange 98%, orange 100%)',
    paddingLeft: "20px"
});

export const TaskDelivered = styled(StyledStrip)({
    background: 'linear-gradient(270deg, rgba(254, 255, 245,1) 98%, rgba(255,255,255,1) 98%, lightgreen 98%, lightgreen 100%)',
    paddingLeft: "20px"
});
