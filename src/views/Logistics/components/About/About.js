import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import {
  useMediaQuery,
  Grid,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  Avatar,
} from '@material-ui/core';
import { SectionHeader } from 'components/molecules';
import { CardBase } from 'components/organisms';

const useStyles = makeStyles(theme => ({
  textWhite: {
    color: 'white',
  },
  card: {
    '& .MuiCardContent-root': {
      justifyContent: 'space-between',
    },
    [theme.breakpoints.up('md')]: {
      marginTop: theme.spacing(-12),
      '& .MuiCardContent-root': {
        padding: theme.spacing(11, 5),
      },
    },
  },
  cardTitle: {
    fontWeight: 'bold',
    [theme.breakpoints.down('sm')]: {
      marginBottom: theme.spacing(2),
    },
  },
  avatar: {
    width: 100,
    height: 100,
    boxShadow: '5px 11px 20px 0px rgba(0, 0, 0, 0.25)',
  },
  listItemAvatar: {
    marginRight: theme.spacing(4),
  },
}));

const About = props => {
  const { className, ...rest } = props;
  const classes = useStyles();

  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  return (
    <div className={className} {...rest}>
      <Grid container spacing={isMd ? 4 : 2}>
        <Grid item container alignItems="center" xs={12} md={6}>
          <SectionHeader
            title={
              <span className={classes.textWhite}>
                Monitor and analyze usage patterns.
              </span>
            }
            subtitle={
              <span className={classes.textWhite}>
                Keep track of what's happening with your data, change
                permissions, and run reports against your data anywhere in the
                world.Keep track of what's happening with your data, change
                permissions, and run reports against your data anywhere in the
                world.Keep track of what's happening with your data, change
                permissions, and run reports against your data anywhere in the
                world.Keep track of what's happening with your data, change
                permissions, and run reports against your data anywhere in the
                world.Keep track of what's happening with your data, change
                permissions, and run reports against your data anywhere in the
                world.
              </span>
            }
            subtitleVariant="body1"
            data-aos="fade-up"
            align="left"
            ctaGroup={[
              <Button variant="contained" size="large">
                Get started
              </Button>,
            ]}
          />
        </Grid>
        <Grid
          item
          container
          justify={isMd ? 'flex-start' : 'center'}
          xs={12}
          md={6}
        >
          <CardBase withShadow liftUp align="left" className={classes.card}>
            <Typography className={classes.cardTitle} variant="h6">
              American Standards And European Culture How To Avoid A
              Disappointing Vacation Experience While Traveling In Europe
            </Typography>
            <List disablePadding>
              <ListItem disableGutters>
                <ListItemAvatar className={classes.listItemAvatar}>
                  <Avatar
                    src="https://assets.maccarianagency.com/the-front/photos/people/jack-smith.jpg"
                    srcSet="https://assets.maccarianagency.com/the-front/photos/people/jack-smith@2x.jpg 2x"
                    alt="Jack Smith"
                    className={classes.avatar}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary="Jack Smith"
                  secondary="Creative Director at Johnson"
                />
              </ListItem>
            </List>
          </CardBase>
        </Grid>
      </Grid>
    </div>
  );
};

About.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
};

export default About;
