import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import {
  useMediaQuery,
  Grid,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
} from '@material-ui/core';
const useStyles = makeStyles(theme => ({
  avatar: {
    background: 'transparent',
    width: 60,
    height: 60,
  },
  listItemAvatar: {
    marginRight: theme.spacing(2),
  },
}));

const Reviews = props => {
  const { data, className, ...rest } = props;
  const classes = useStyles();

  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  return (
    <div className={className} {...rest}>
      <Grid container spacing={isMd ? 4 : 2}>
        {data.map((item, index) => (
          <Grid item xs={12} sm={6} key={index} data-aos="fade-up">
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <ListItem disableGutters>
                  <ListItemAvatar className={classes.listItemAvatar}>
                    <Avatar src={item.logo} className={classes.avatar} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={item.title}
                    primaryTypographyProps={{
                      variant: 'h5',
                    }}
                  />
                </ListItem>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" component="p" color="textSecondary">
                  "{item.feedback}"
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <ListItem disableGutters>
                  <ListItemText primary={item.city} secondary="TheFront User" />
                </ListItem>
              </Grid>
            </Grid>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

Reviews.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
  /**
   * data to be rendered
   */
  data: PropTypes.array.isRequired,
};

export default Reviews;
