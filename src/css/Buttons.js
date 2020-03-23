import {styled} from "@material-ui/styles";
import AddCircleOutline from "@material-ui/icons/AddCircleOutline";

export const StyledAddCircleOutline = styled(AddCircleOutline)({
    cursor: "pointer",
    color: "darkblue",
    width: "100px",
    height: "100px",
    margin: "15px",
    borderRadius: "50%",
    background: "white"
});


export const StyledAddCircleOutlineSmall = styled(AddCircleOutline)({
    cursor: "pointer",
    color: "darkblue",
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    background: "white"
});

export const StyledAddCircleOutlineDisabled = styled(StyledAddCircleOutline)({
    color: "grey",
});


export const StyledAddCircleOutlineSmallDisabled = styled(StyledAddCircleOutlineSmall)({
    color: "grey",
});

