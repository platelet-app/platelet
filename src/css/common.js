import React from 'react';
import '../App.css';
import 'typeface-roboto'
import Card from '@material-ui/core/Card';
import AddCircleOutline from '@material-ui/icons/AddCircleOutline';
import {styled} from '@material-ui/styles';

import {makeStyles} from '@material-ui/core/styles';

export const StyledAddCircleOutline = styled(AddCircleOutline)( {
    cursor: "pointer",
    color: "darkblue",
    width: "150px",
    height: "150px",
    borderRadius: "50%",
    background:"white"
});

export const StyledCard = styled(Card)({
    background: 'white',
    border: 0,
    borderRadius: 10,
    boxShadow: '0 3px 5px 2px #303030',
    color: 'black',
    padding: '1vh 1vw',
    minHeight: '200px',
    height: "100%"
});

export const TaskAdded = styled(Card)({
    background: 'linear-gradient(0deg, rgba(254, 255, 245,1) 90%, rgba(255,255,255,1) 90%, rgba(252, 231, 121, 1) 90%, rgba(252, 231, 121, 1) 100%)',
    border: 0,
    borderRadius: 10,
    boxShadow: '0 3px 5px 2px #303030',
    color: 'black',
    padding: '1vh 1vw',
    minHeight: '200px',
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
    minHeight: '200px',
    height: "100%",
    cursor: "pointer"
});

export const TaskAssigned = styled(Card)({
    background: 'linear-gradient(0deg, rgba(254, 255, 245,1) 90%, rgba(255,255,255,1) 90%, cornflowerblue 90%, rgba(100,149,237,1) 100%)',
    border: 0,
    borderRadius: 10,
    boxShadow: '0 3px 5px 2px #303030',
    color: 'black',
    padding: '1vh 1vw',
    minHeight: '200px',
    height: "100%",
    cursor: "pointer"
});

export const TaskActive = styled(Card)({
    background: 'linear-gradient(0deg, rgba(254, 255, 245,1) 90%, rgba(255,255,255,1) 90%, orange 90%, orange 100%)',
    border: 0,
    borderRadius: 10,
    boxShadow: '0 3px 5px 2px #303030',
    color: 'black',
    padding: '1vh 1vw',
    minHeight: '200px',
    height: "100%",
    cursor: "pointer"
});

export const TaskDelivered = styled(Card)({
    background: 'linear-gradient(0deg, rgba(254, 255, 245,1) 90%, rgba(255,255,255,1) 90%, lightgreen 90%, lightgreen 100%)',
    border: 0,
    borderRadius: 10,
    boxShadow: '0 3px 5px 2px #303030',
    color: 'black',
    padding: '1vh 1vw',
    minHeight: '200px',
    height: "100%",
    cursor: "pointer"
});

export const Background = makeStyles({
    default: {
        background: 'red'
    }
});