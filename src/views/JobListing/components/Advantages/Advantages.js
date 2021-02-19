import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Button } from '@material-ui/core';
import { LearnMoreLink } from 'components/atoms';
import { SectionHeader, IconAlternate } from 'components/molecules';
import { DescriptionListIcon } from 'components/organisms';

const useStyles = makeStyles(theme => ({
  icon: {
    backgroundColor: 'transparent !important',
    borderRadius: 0,
    borderBottom: `2px solid`,
    width: 'auto',
  },
  learnMoreLink: {
    alignSelf: 'flex-start',
    marginTop: theme.spacing(2),
  },
}));

const Advantages = props => {
  const { data, className, ...rest } = props;
  const classes = useStyles();

  return (
    <div className={className} {...rest}>
      <SectionHeader title="Our process to find you a new job is fast" fadeUp />
      <Grid container spacing={4}>
        {data.map((item, index) => (
          <Grid
            key={index}
            item
            container
            alignItems="center"
            direction="column"
            xs={12}
            sm={12}
            md={4}
            data-aos="fade-up"
          >
            <DescriptionListIcon
              icon={
                <IconAlternate
                  fontIconClass={item.icon}
                  color={item.color}
                  className={classes.icon}
                  style={{ borderColor: item.color[500] }}
                />
              }
              title={item.title}
              subtitle={item.subtitle}
              align="left"
            />
            <div style={{ flexGrow: 1 }} />
            <LearnMoreLink
              title="Learn more"
              variant="body1"
              className={classes.learnMoreLink}
              color="primary"
            />
          </Grid>
        ))}
        <Grid item container xs={12} justify="center">
          <Button variant="contained" size="large" color="primary">
            get started
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

Advantages.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
  /**
   * data to be rendered
   */
  data: PropTypes.array.isRequired,
};

export default Advantages;
