import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import {
  useMediaQuery,
  Grid,
  Typography,
  FormControlLabel,
  Checkbox,
  Button,
  Divider,
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  titleCta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
}));

const Notifications = props => {
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
          <div className={classes.titleCta}>
            <Typography variant="h6" color="textPrimary">
              Notifications
            </Typography>
            <Button variant="outlined" color="primary">
              Reset all
            </Button>
          </div>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            System settings
          </Typography>
          <Typography variant="caption" gutterBottom>
            You will recieve emails in your business email address
          </Typography>
          <div>
            <div>
              <FormControlLabel
                control={<Checkbox defaultChecked={true} color="primary" />}
                label="E-mail alerts"
              />
            </div>
            <div>
              <FormControlLabel
                control={<Checkbox defaultChecked={true} color="primary" />}
                label="Push notifications"
              />
            </div>
            <div>
              <FormControlLabel
                control={<Checkbox defaultChecked={true} color="primary" />}
                label="Text messages"
              />
            </div>
            <div>
              <FormControlLabel
                control={<Checkbox defaultChecked={false} color="primary" />}
                label="Phone calles"
              />
            </div>
          </div>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Chat settings
          </Typography>
          <Typography variant="caption" gutterBottom>
            You will recieve emails in your business email address
          </Typography>
          <div>
            <div>
              <FormControlLabel
                control={<Checkbox defaultChecked={false} color="primary" />}
                label="E-mail alerts"
              />
            </div>
            <div>
              <FormControlLabel
                control={<Checkbox defaultChecked={true} color="primary" />}
                label="Push notifications"
              />
            </div>
          </div>
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

Notifications.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
};

export default Notifications;
