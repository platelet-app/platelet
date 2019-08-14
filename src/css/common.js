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

    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    padding: '0 30px',
});

export const Background = makeStyles({
    default: {
        background: 'red'
    }
});