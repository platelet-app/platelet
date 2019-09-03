import React from 'react';
import '../App.css';
import 'typeface-roboto'
import Card from '@material-ui/core/Card';
import {styled} from '@material-ui/styles';

import {makeStyles} from '@material-ui/core/styles';

export const StyledCard = styled(Card)({
    background: 'white',
    border: 0,
    borderRadius: 10,
    boxShadow: '0 3px 5px 2px #303030',
    color: 'black',
    padding: '1vh 1vw',
});

export const TaskAdded = styled(Card)({
    background: 'linear-gradient(0deg, rgba(254, 255, 245,1) 90%, rgba(255,255,255,1) 90%, cornflowerblue 90%, rgba(100,149,237,1) 100%)',
    border: 0,
    borderRadius: 10,
    boxShadow: '0 3px 5px 2px #303030',
    color: 'black',
    padding: '1vh 1vw',
    minWidth: '300px',
    minHeight: '200px'
});

export const TaskNew = styled(Card)({
    background: 'linear-gradient(0deg, rgba(254, 255, 245,1) 90%, rgba(255,255,255,1) 90%, cornflowerblue 90%, rgba(100,149,237,1) 100%)',
    border: 0,
    borderRadius: 10,
    boxShadow: '0 3px 5px 2px #303030',
    color: 'black',
    padding: '1vh 1vw',
    minWidth: '300px',
    minHeight: '200px'
});

export const TaskAssigned = styled(Card)({
    background: 'linear-gradient(0deg, rgba(254, 255, 245,1) 90%, rgba(255,255,255,1) 90%, cornflowerblue 90%, rgba(100,149,237,1) 100%)',
    border: 0,
    borderRadius: 10,
    boxShadow: '0 3px 5px 2px #303030',
    color: 'black',
    padding: '1vh 1vw',
    minWidth: '300px',
    minHeight: '200px'
});

export const TaskActive = styled(Card)({
    background: 'linear-gradient(0deg, rgba(254, 255, 245,1) 90%, rgba(255,255,255,1) 90%, orange 90%, orange 100%)',
    border: 0,
    borderRadius: 10,
    boxShadow: '0 3px 5px 2px #303030',
    color: 'black',
    padding: '1vh 1vw',
    minWidth: '300px',
    minHeight: '200px'
});

export const TaskDelivered = styled(Card)({
    background: 'linear-gradient(0deg, rgba(254, 255, 245,1) 90%, rgba(255,255,255,1) 90%, lightgreen 90%, lightgreen 100%)',
    border: 0,
    borderRadius: 10,
    boxShadow: '0 3px 5px 2px #303030',
    color: 'black',
    padding: '1vh 1vw',
    minWidth: '300px',
    minHeight: '200px'
});

export const Background = makeStyles({
    default: {
        background: 'red'
    }
});