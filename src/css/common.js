import React from 'react';
import '../App.css';
import 'typeface-roboto'
import Card from '@material-ui/core/Card';
import Container from "@material-ui/core/Container";
import {styled} from '@material-ui/styles';

import {makeStyles} from '@material-ui/core/styles';
import {Paper} from "@material-ui/core";
import Box from "@material-ui/core/Box";

export function MainWindowContainer(props) {
    const styles = makeStyles({
        root: {
            paddingLeft: 30,
            paddingTop: 100,
            paddingRight: 30,
            paddingBottom: "100%",
            background: "rgb(230, 230, 230)",
            align: "left",
            width: "100%",
            height: "100%"
        },
        content: {
            maxWidth: "1920px",
            height: "100%"
        }
    });
    const classes = styles();
    return (
        <div className={classes.root}>
            <div className={classes.content}>
                {props.children}
            </div>
        </div>
    )
}


export const StyledColumn = styled(Box)({
    border: 0,
    boxShadow: '0 4px 6px 3px rgba(100, 100, 100, .3)',
    height: "100%",
    background: "rgba(255, 255, 255, 0.8)",
    padding: "20px"
});


export const StyledCard = styled(Card)({
    background: "rgb(250, 248, 248)",
    border: 0,
    borderRadius: 10,
    boxShadow: '0 3px 5px 2px #303030',
    color: 'black',
    padding: '20px',
    height: '250px',
    width: '300px',
    cursor: "pointer"
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
    return (
        <Paper style={{maxWidth: maxWidth, padding: padding}}>
            {props.children}
        </Paper>
    )
}
