import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { ContactForm } from '../../../../components/ContactForm'

const step1Styles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      flexDirection: 'column',
      flexWrap: 'wrap',
    },
  }));

export const Step1 = () => {
    return (
        <div>
            <Box p={1}>
                <Typography>{"What are the caller's contact details?"}</Typography>
            </Box>
            <ContactForm />
        </div>
    )
}
