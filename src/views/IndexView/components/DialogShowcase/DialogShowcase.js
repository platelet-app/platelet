import React from "react";
import {HeroBackground, HeroShaped, HeroSideImage} from "../../../../components/organisms";
import {Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import dialog_light from "../../../../assets/images/dialog-light.png"
import dialog_dark from "../../../../assets/images/dialog-dark.png"
import {Services} from "../index";
import {HeroSideImageExample} from "../../../../views.default/Documentation/examples";

const useStyles = makeStyles(theme => ({
    imageBackgroundLight: {
        background: `url(${dialog_light})`,
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'scroll',
        backgroundSize: 'cover',
        width: '600px',
        height: '600px',
    },
    imageBackgroundDark: {
        background: `url(${dialog_dark})`,
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'scroll',
        backgroundSize: 'cover',
        width: '600px',
        height: '600px',
    },
    servicesClass: {
        height: "80%"
    }
}))


const DialogShowcase = ({themeMode = 'light', ...rest}) => {
    const classes = useStyles();
    const rightSide = <Services className={classes.servicesClass}/>

    const leftSide = <div
        className={themeMode === 'dark' ? classes.imageBackgroundDark : classes.imageBackgroundLight}>
    </div>
    return (
        <HeroSideImage imageSrc={themeMode === 'dark' ? dialog_dark : dialog_light}><Services/></HeroSideImage>
    )

}

export default DialogShowcase;

