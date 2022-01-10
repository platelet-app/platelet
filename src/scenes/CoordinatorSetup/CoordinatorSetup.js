import React from "react";
import makeStyles from '@mui/styles/makeStyles';
import {Grid} from '@mui/material';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';

import { GuidedSetup } from '../GuidedSetup/GuidedSetup'
import { RiderJobActivity } from './components/RiderJobActivity'
import { EnhancedTable } from './components/EnhancedTable'
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const setupStyles = makeStyles((theme) => ({
    container: {
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        left: "0",
        top: "5%",
        width: "100%",
        height: "100%",
        background: "white",
        padding: "20px 30px"
    },
    leftSide: {
        width: '60%',
        [theme.breakpoints.down('md')]: {
            width: '100%',
        },
    },
    rightSide: {
        width: '40%',
        [theme.breakpoints.down('md')]: {
            width: '100%',
        },
    }
  }));

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

export const CoordinatorSetup = ({ onClose }) => {
    const classes = setupStyles();
    
    return (
        <div className={classes.container}>
            <Box p={3}>
                <Typography>{"Rider Job Activity"}</Typography>
            </Box>
            <Stack
                divider={<Divider orientation={{ xs: 'horizontal', sm: 'horizontal', md: 'vertical', lg: 'vertical' }} />}
                direction={{ xs: 'column', sm: 'column', md: 'row', lg: 'row' }}
                spacing={2}
            >
                <div className={classes.leftSide}>
                    <RiderJobActivity />
                    <EnhancedTable />
                </div>

                <div className={classes.rightSide}>
                    <GuidedSetup />
                </div>

            </Stack> 
        </div>
    )
}
