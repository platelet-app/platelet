import React from 'react';
import '../App.css';
import 'typeface-roboto'
import Card from '@material-ui/core/Card';
import AddCircleOutline from '@material-ui/icons/AddCircleOutline';
import Container from "@material-ui/core/Container";
import {styled} from '@material-ui/styles';

import {makeStyles} from '@material-ui/core/styles';
import {Paper} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";

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
    const classes = styles()
    return (
        <div className={classes.root}>
            <div className={classes.content}>
                {props.children}
            </div>
        </div>
    )
};


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

export const StyledCard = styled(Card)({
    background: "rgb(250, 248, 248)",
    border: 0,
    borderRadius: 10,
    boxShadow: '0 3px 5px 2px #303030',
    color: 'black',
    padding: '1vh 1vw',
    minHeight: '200px',
    minWidth: '200px',
    height: "100%"
});

export const TaskAdded = styled(Card)({
    background: 'linear-gradient(0deg, rgba(250, 248, 248,1) 90%, rgba(255,255,255,1) 90%, rgba(252, 231, 121, 1) 90%, rgba(252, 231, 121, 1) 100%)',
    border: 0,
    borderRadius: 10,
    boxShadow: '0 3px 5px 2px #303030',
    color: 'black',
    padding: '1vh 1vw',
    minHeight: '200px',
    minWidth: '200px',
    height: "100%",
    cursor: "pointer"
});

export const TaskNew = styled(Card)({
    background: 'linear-gradient(0deg, rgba(254, 255, 245,1) 90%, rgba(255,255,255,1) 90%, rgba(252, 231, 121, 1) 90%, rgba(252, 231, 121, 1) 100%)',
    border: 0,
    borderRadius: 10,
    boxShadow: '0 3px 5px 2px #303030',
    color: 'black',
    padding: '1vh 1vw',
    height: '250px',
    width: '300px',
    cursor: "pointer"
});

export const TaskAssigned = styled(Card)({
    background: 'linear-gradient(0deg, rgba(254, 255, 245,1) 90%, rgba(255,255,255,1) 90%, cornflowerblue 90%, rgba(100,149,237,1) 100%)',
    border: 0,
    borderRadius: 10,
    boxShadow: '0 3px 5px 2px #303030',
    color: 'black',
    padding: '1vh 1vw',
    height: '250px',
    width: '300px',
    cursor: "pointer"
});

export const TaskActive = styled(Card)({
    background: 'linear-gradient(0deg, rgba(254, 255, 245,1) 90%, rgba(255,255,255,1) 90%, orange 90%, orange 100%)',
    border: 0,
    borderRadius: 10,
    boxShadow: '0 3px 5px 2px #303030',
    color: 'black',
    padding: '1vh 1vw',
    height: '250px',
    width: '300px',
    cursor: "pointer"
});

export const TaskDelivered = styled(Card)({
    background: 'linear-gradient(0deg, rgba(254, 255, 245,1) 90%, rgba(255,255,255,1) 90%, lightgreen 90%, lightgreen 100%)',
    border: 0,
    borderRadius: 10,
    boxShadow: '0 3px 5px 2px #303030',
    color: 'black',
    padding: '1vh 1vw',
    height: '250px',
    width: '300px',
    cursor: "pointer"
});

export const Background = makeStyles({
    default: {
        background: 'red'
    }
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
