import React from 'react';
import '../App.css';
import 'typeface-roboto'
import Card from '@material-ui/core/Card';
import {styled} from '@material-ui/styles';

import CardContent from '@material-ui/core/CardContent';
import {makeStyles} from '@material-ui/core/styles';
import {Typography} from "@material-ui/core";
import {convertDate} from '../utilities'
import {BrowserRouter as Router, Route, Link} from "react-router-dom";

export const StyledCard = styled(Card)({
    background: 'cornflowerblue',
    border: 0,
    borderRadius: 10,
    boxShadow: '0 3px 5px 2px #303030',
    color: 'white',
    padding: '1vh 1vw',
});

export const TaskNew = styled(Card)({

    background: 'cornflowerblue',
    border: 0,
    borderRadius: 10,
    boxShadow: '0 3px 5px 2px #303030',
    color: 'white',
    padding: '1vh 1vw',
});

export const TaskAssigned = styled(Card)({

    background: 'darkred',
    border: 0,
    borderRadius: 10,
    boxShadow: '0 3px 5px 2px #303030',
    color: 'white',
    padding: '1vh 1vw',
});

export const TaskActive = styled(Card)({

    background: 'orange',
    border: 0,
    borderRadius: 10,
    boxShadow: '0 3px 5px 2px #303030',
    color: 'white',
    padding: '1vh 1vw',
});

export const TaskDelivered = styled(Card)({

    background: 'lightgreen',
    border: 0,
    borderRadius: 10,
    boxShadow: '0 3px 5px 2px #303030',
    color: 'white',
    padding: '1vh 1vw',
});

export const Background = makeStyles({
    default: {
        background: 'red'
    }
});