import React from 'react';
import '../App.css';
import 'typeface-roboto'
import Card from '@material-ui/core/Card';
import {styled} from '@material-ui/styles';
import Container from "@material-ui/core/Container";

import {makeStyles} from '@material-ui/core/styles';
import {Paper} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import {Link} from "react-router-dom"
import IconButton from "@material-ui/core/IconButton";
import ClearIcon from "@material-ui/icons/Clear";
import Grid from "@material-ui/core/Grid";

export const showHide = makeStyles({
    hide: {display: "none"},
    show: {display: "inherit"},
})

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


export function MainWindowContainer(props) {
    const styles = makeStyles({
        root: {
            paddingTop: "100px",
            paddingBottom: "100px"
        }
    });
    const classes = styles();
    return (
        <Container className={classes.root}>
            {props.children}
        </Container>
    )
}

export const StyledTextLink = styled(Link)({
    a: {
        "&:hover": {
            background: "red"
        }
    },
    textDecoration: "none"
});

export const StyledColumn = styled(Box)({
    border: 0,
    boxShadow: '0 2px 3px 1px rgba(100, 100, 100, .3)',
    height: "100%",
    background: "rgba(255, 255, 255, 0.8)",
});


export const StyledCard = styled(Card)({
    background: "rgb(252, 252, 252)",
    border: 0,
    borderRadius: 2,
    boxShadow: '0 1px 2px 1px #7a7a7a',
    color: 'black',
    width: "auto",
    padding: '10px'
});

export const StyledSharpCard = styled(Card)({
    background: "rgb(252, 252, 252)",
    border: 0,
    borderRadius: 2,
    boxShadow: '0 3px 5px 2px #7a7a7a',
    color: 'black',
    padding: '20px',
});

export const StyledStrip = styled(Card)({
    background: "rgb(250, 248, 248)",
    color: 'black',
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
    return (
        <Paper style={
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
            <Grid container direction={"row"} alignItems={"flex-start"} justify={"center"}>
                <Grid item>
                    {props.children}
                </Grid>
            </Grid>
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
