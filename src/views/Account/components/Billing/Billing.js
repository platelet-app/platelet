import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import {
  useMediaQuery,
  Grid,
  Typography,
  TextField,
  Button,
  Divider,
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  inputTitle: {
    fontWeight: 700,
    marginBottom: theme.spacing(1),
  },
}));

const Billing = props => {
  const { className, ...rest } = props;
  const classes = useStyles();

  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  return (
    <div className={className} {...rest}>
      <Grid container spacing={isMd ? 4 : 2}>
        <Grid item xs={12}>
          <Typography variant="h6" color="textPrimary">
            Billing Information
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            Card Number
          </Typography>
          <TextField
            placeholder="Account number or IBAN"
            variant="outlined"
            size="medium"
            name="cardNumber"
            fullWidth
            type="text"
          />
        </Grid>
        <Grid item xs={8}>
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            Expiration date
          </Typography>
          <TextField
            placeholder="Card expiration date"
            variant="outlined"
            size="medium"
            name="expDate"
            fullWidth
            type="text"
          />
        </Grid>
        <Grid item xs={4}>
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            CVV
          </Typography>
          <TextField
            placeholder="Card CVV"
            variant="outlined"
            name="cvv"
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={8}>
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            Full name
          </Typography>
          <TextField
            placeholder="Name on the card"
            variant="outlined"
            size="medium"
            name="name"
            fullWidth
            type="text"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography
            variant="subtitle1"
            color="textPrimary"
            className={classes.inputTitle}
          >
            Billing zip code
          </Typography>
          <TextField
            placeholder="Billing address zip code"
            variant="outlined"
            size="medium"
            name="zip"
            fullWidth
            type="text"
          />
        </Grid>
        <Grid item container justify="flex-start" xs={12}>
          <Button
            variant="contained"
            type="submit"
            color="primary"
            size="large"
          >
            save
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

Billing.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
};

export default Billing;
