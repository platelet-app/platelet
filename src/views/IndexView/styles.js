import {makeStyles} from "@material-ui/core/styles";
import dashboard_light from "../../assets/images/dashboard-light.png";
import dashboard_dark from "../../assets/images/dashboard-dark.png";
import dialog_light from "../../assets/images/dialog-light-new.png";
import dialog_dark from "../../assets/images/dialog-dark-new.png";
import mobile_light from "../../assets/images/mobile-light.png";
import mobile_dark from "../../assets/images/mobile-dark.png";

const showCaseStyles = makeStyles(theme => ({
    root: {
        height: 600
    },
    text: {
        [theme.breakpoints.down('sm')]: {
            height: 400,
            width: "100%",
        },
        height: 700,
        width: 400,
        display: "flex"
    },
    item: {
        width: "100%",
        maxWidth: 550
    },
    background: {
        [theme.breakpoints.down('sm')]: {
            height: 530,
            width: "100%",
        },
        height: 700,
        backgroundRepeat: "no-repeat",
        width: 550,
        backgroundSize: "contain",
        backgroundPosition:"center"
    },
    dashboardBack: {
        backgroundImage: `url(${dashboard_light})`,
    },
    dashboardBackDark: {
        backgroundImage: `url(${dashboard_dark})`,
    },
    dialogBack: {
        backgroundImage: `url(${dialog_light})`
    },
    dialogBackDark: {
        backgroundImage: `url(${dialog_dark})`
    },
    mobileBack: {
        backgroundImage: `url(${mobile_light})`
    },
    mobileBackDark: {
        backgroundImage: `url(${mobile_dark})`
    }
}))

export default showCaseStyles;
