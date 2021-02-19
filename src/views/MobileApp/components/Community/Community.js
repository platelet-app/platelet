import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Button, Avatar, Typography } from '@material-ui/core';
import { SectionHeader } from 'components/molecules';
import { HeroSimpleBackground } from 'components/organisms';

const useStyles = makeStyles(theme => ({
  avatar: {
    width: 60,
    height: 60,
    border: `${theme.spacing(1)}px solid ${theme.palette.background.paper}`,
    boxShadow: `0 2px 10px 0 ${theme.palette.cardShadow}`,
    marginTop: theme.spacing(1 / 2),
    [theme.breakpoints.up('sm')]: {
      width: 80,
      height: 80,
    },
  },
  grid: {
    maxWidth: 600,
    margin: '0 auto',
  },
}));

const Community = props => {
  const { data, className, ...rest } = props;
  const classes = useStyles();

  return (
    <div className={className} {...rest}>
      <SectionHeader
        title={
          <span>
            Join the biggest community of{' '}
            <Typography color="secondary" variant="inherit" component="span">travellers</Typography>
          </span>
        }
        subtitle="Don't listen to what they say go and see. Travelling with our app is easy."
        ctaGroup={[
          <Button color="primary" variant="contained" size="large">
            Try for free
          </Button>,
          <Button color="secondary" variant="outlined" size="large">
            See pricings
          </Button>,
        ]}
        label="build up a community"
        data-aos="fade-up"
      />
      <HeroSimpleBackground
        backgroundImage="https://assets.maccarianagency.com/the-front/illustrations/map.png"
        backgroundSize="contain"
      >
        <Grid container spacing={0} className={classes.grid} data-aos="fade-up">
          {data.map((item, index) => (
            <Grid
              item
              container
              key={index}
              xs={4}
              direction={index < 3 ? 'row' : 'row-reverse'}
            >
              <Grid item xs={6}>
                <Avatar
                  {...item.authorPhoto}
                  className={classes.avatar}
                  data-aos="zoom-in"
                  data-aos-once="false"
                />
              </Grid>
              <Grid item xs={6}></Grid>
            </Grid>
          ))}
        </Grid>
      </HeroSimpleBackground>
    </div>
  );
};

Community.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
  /**
   * data to be rendered
   */
  data: PropTypes.array.isRequired,
};

export default Community;
