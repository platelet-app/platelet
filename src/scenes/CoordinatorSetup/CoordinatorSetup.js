import React from "react";
import { makeStyles } from 'tss-react/mui';
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

const setupStyles = makeStyles()((theme) => ({
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
  }));

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

export const CoordinatorSetup = ({ show, onClose }) => {
    const { classes } = setupStyles();
    
    return (
        <div className={classes.container}>
            <Box p={3}>
                <Typography>{"Rider Job Activity"}</Typography>
            </Box>
            <Stack
                divider={<Divider orientation="vertical" />}
                direction={{ xs: 'column', sm: 'row' }}
                spacing={{ xs: 1, sm: 2, md: 4 }}
            >
                <div>
                    <RiderJobActivity />
                    <EnhancedTable />
                </div>
                <div>
                    <GuidedSetup />
                </div>
            </Stack> 
        </div>
    )
}
