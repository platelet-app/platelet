import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/core/styles';
import {Button, Grid, TextField, Typography} from '@material-ui/core';
import {SectionHeader} from 'components/molecules';
import postEmailToMailingList from "./MailingListSignupFetch";

const useStyles = makeStyles(() => ({
    fontWeight900: {
        fontWeight: 900,
    },
}));

function validateEmail(email) {
    if (!email)
        return true;
    const regexp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regexp.test(email);
}

const GetStarted = ({className, ...rest}) => {
    const classes = useStyles();
    const title = "Sign up to our mailing list to stay up to date";
    const subtitle = 'Your email will only be used to let you know when platelet is live.';
    const [email, setEmail] = useState("");
    const [success, setSuccess] = useState(undefined);
    const [loading, setLoading] = useState(false);
    const [validated, setValidated] = useState(true);

    const message = success === undefined ? <></> :
        <Typography>{success ? "Submitted. Thank you for your interest!" : "Sorry, something went wrong. Please try again."}</Typography>

    useEffect(() => setValidated(validateEmail(email)), [email])

    const button = (
        <Button
            size="large"
            variant="contained"
            color="primary"
            disabled={loading || !email || !validated}
            onClick={() => {
                setLoading(true);
                setSuccess(undefined);
                postEmailToMailingList(email).then(response => {
                    setSuccess(response.status === 201)
                    if (response.status === 201)
                        setEmail("");
                    setLoading(false);
                })
            }
            }
        >
            Submit
        </Button>
    );
    const form = (
        <TextField
            value={email}
            error={!validated}
            helperText={validated ? "" : "Please use a valid email."}
            onChange={e => setEmail(e.target.value)}
            variant={"outlined"}
            InputProps={{type: "email"}}
        />
    )
    return (
        <Grid container spacing={2} direction={"column"} alignItems={"center"} justify={"center"} className={className} {...rest}>
            <Grid item>
                <SectionHeader
                    title={title}
                    subtitle={subtitle}
                    align="center"
                    titleProps={{
                        variant: 'h2',
                        color: 'textPrimary',
                        className: classes.fontWeight900,
                    }}
                />
            </Grid>
            <Grid item>
                {form}
            </Grid>
            <Grid item>
                {button}
            </Grid>
            <Grid item>
                {message}
            </Grid>
        </Grid>
    );
};

GetStarted.propTypes =
{
    /**
     * External classes
     */
    className: PropTypes.string,
};

export default GetStarted;
