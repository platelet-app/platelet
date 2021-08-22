import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { ContactForm } from '../../../../components/ContactForm'
import DropOffDetails from "../../../Task/components/DropOffDetails";

export const Step3 = () => {
    return (
        <div>
            <Typography>{"Where is it being delivered?"}</Typography>
            <DropOffDetails />
            <Typography>{"Recipient contact:"}</Typography>
            <ContactForm />
        </div>
    )
}
