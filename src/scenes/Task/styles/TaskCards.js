import { styled } from "@mui/styles";
import { StyledCard } from "../../../styles/common";
import { withTheme } from "@mui/material";

const colourBarPercent = "90%";

export const TaskAdded = styled(StyledCard)({
    background: `linear-gradient(0deg, rgba(255, 248, 248,1) ${colourBarPercent}, rgba(255,255,255,1) 90%, rgba(252, 231, 121, 1) 90%, rgba(252, 231, 121, 1) 100%)`,
    cursor: "pointer",
});

export const TaskNew = styled(withTheme(StyledCard))((props) => ({
    background: `linear-gradient(0deg, rgba(250, 250, 250,1) ${colourBarPercent}, rgba(255,255,255,1) 90%, ${props.theme.taskStatus.new} 90%, ${props.theme.taskStatus.new} 100%)`,
    cursor: "pointer",
}));

export const TaskAssigned = styled(StyledCard)({
    background: `linear-gradient(0deg, rgba(250, 250, 250,1) ${colourBarPercent}, rgba(255,255,255,1) 90%, cornflowerblue 90%, cornflowerblue 100%)`,
    cursor: "pointer",
});

export const TaskActive = styled(StyledCard)({
    background: `linear-gradient(0deg, rgba(250, 250, 250,1) ${colourBarPercent}, rgba(255,255,255,1) 90%, orange 90%, orange 100%)`,
    cursor: "pointer",
});

export const TaskDelivered = styled(StyledCard)({
    background: `linear-gradient(0deg, rgba(250, 250, 250,1) ${colourBarPercent}, rgba(255,255,255,1) 90%, lightgreen 90%, lightgreen 100%)`,
    cursor: "pointer",
});
