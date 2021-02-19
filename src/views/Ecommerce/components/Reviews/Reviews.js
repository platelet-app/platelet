import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import {
  useMediaQuery,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
} from '@material-ui/core';
import { SectionHeader } from 'components/molecules';

const useStyles = makeStyles(theme => ({
  textWhite: {
    color: 'white',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: theme.spacing(1),
  },
  listItemAvatar: {
    marginRight: theme.spacing(3),
  },
  gridCard: {
    padding: theme.spacing(2),
    background: theme.palette.alternate.main,
    borderRadius: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(4),
    },
  },
  gridItem: {
    height: '100%',
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
      <SectionHeader
        title={
          <span className={classes.textWhite}>
            Trusted by the world’s most innovative businesses – big and small
          </span>
        }
        subtitle={
          <span className={classes.textWhite}>
            After 3 days all of your offers will arrive and you will have
            another 7 days to select your new company.
          </span>
        }
        subtitleColor="textPrimary"
        data-aos="fade-up"
      />
      <Grid container spacing={4}>
        {data.map((item, index) => (
          <Grid item xs={12} md={6} key={index} className={classes.gridItem}>
            <Grid
              container
              className={classes.gridCard}
              data-aos="fade-up"
              spacing={2}
            >
              <Grid
                item
                container
                justify={isMd ? 'flex-start' : 'center'}
                alignItems="center"
                xs={12}
              >
                <List disablePadding>
                  <ListItem disableGutters>
                    <ListItemAvatar className={classes.listItemAvatar}>
                      <Avatar
                        {...item.authorPhoto}
                        alt={item.authorName}
                        className={classes.avatar}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={item.authorName}
                      secondary={item.authorOccupation}
                    />
                  </ListItem>
                </List>
              </Grid>
              <Grid
                item
                container
                justify="space-between"
                alignItems={isMd ? 'flex-start' : 'center'}
                xs={12}
              >
                <Typography
                  variant="body1"
                  color="textPrimary"
                  align={isMd ? 'left' : 'center'}
                >
                  "{item.feedback}"
                </Typography>
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
   * Data to be rendered
   */
  data: PropTypes.array.isRequired,
};

export default Reviews;
