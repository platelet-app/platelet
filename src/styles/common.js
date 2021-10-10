import React from 'react';
import '../App.css';
import 'typeface-roboto'
import Card from '@material-ui/core/Card';
import {styled} from '@material-ui/styles';
import Container from "@material-ui/core/Container";

import {makeStyles, withTheme} from '@material-ui/core/styles';
import {Paper} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import {Link} from "react-router-dom"
import IconButton from "@material-ui/core/IconButton";
import ClearIcon from "@mui/icons-material/Clear";

export const showHide = makeStyles({
    // not using display none because it lags horribly on mobile chrome for some reason
    hide: {
        position: "absolute!important",
        top: "-9999px!important",
        left: "-9999px!important"
    },
    show: {},
});

export function DismissButton(props) {
    return (
        <IconButton
            color="inherit"
            aria-controls="simple-menu"
            aria-haspopup="true"
            size="small"
            onClick={props.onClick}>
            <ClearIcon/>
        </IconButton>
    )
}

export const ThemedLink = styled(withTheme(Link))(props => ({
        color: props.theme.palette.text.primary
    })
)


export const StyledColumn = styled(Box)({
    border: 0,
    boxShadow: '0 2px 3px 1px rgba(100, 100, 100, .3)',
    height: "100%",
    minHeight: "100%",
    width: "383px",
});


export const StyledCard = styled(Card)({
    border: 0,
    borderRadius: 2,
    boxShadow: '0 1px 2px 1px #7a7a7a',
    width: "100%",
    height: "200px",
});

export const StyledSharpCard = styled(Card)({
    border: 0,
    borderRadius: 2,
    boxShadow: '0 3px 5px 2px #7a7a7a',
    padding: '20px',
});

export const StyledStrip = styled(Card)({
    borderRadius: 0,
    padding: '0px',
    height: '50px',
    width: '1200px',
    cursor: "pointer"
});

export function PaddedPaper(props) {
    const padding = props.padding ? props.padding : "30px";
    const maxWidth = props.maxWidth ? props.maxWidth : "1000px";
    const minWidth = props.minWidth ? props.minWidth : "30px";
    const maxHeight = props.maxHeight ? props.maxHeight : "100%";
    const minHeight = props.minHeight ? props.minHeight : "30px";
    const className = props.className;
    return (
        <Paper className={className} style={
            {
                width: props.width ? props.width : "100%",
                height: props.height ? props.height : "100%",
                maxWidth: maxWidth,
                minWidth: minWidth,
                maxHeight: maxHeight,
                minHeight: minHeight,
                padding: padding
            }
        }>
            {props.children}
        </Paper>
    )
}

export const contextDots = makeStyles({
    root: {
        cursor: 'context-menu',
        position: "absolute",
        bottom: 0,
        right: 0,
        zIndex: 1000
    }
})
