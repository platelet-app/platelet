import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Grid, Button, useMediaQuery, NoSsr, colors } from '@material-ui/core';
import { SectionHeader } from 'components/molecules';
import { CardBase, DescriptionListIcon } from 'components/organisms';

const useStyles = makeStyles(theme => ({
  iconCover: {
    width: 60,
    height: 60,
    background: 'url(https://assets.maccarianagency.com/the-front/illustrations/bgicon.svg) no-repeat center center',
    backgroundSize: 'contain',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: colors.yellow[700],
    fontSize: 35,
    [theme.breakpoints.up('md')]: {
      width: 80,
      height: 80,
      fontSize: 40,
    },
  },
  cta: {
    marginTop: theme.spacing(3),
  },
}));

const HowItWorks = props => {
  const { data, className, ...rest } = props;
  const classes = useStyles();

  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  return (
    <div className={className} {...rest}>
      <CardBase withShadow>
        <>
        <SectionHeader label="Process we do" title="How it works" />
        <Grid container spacing={isMd ? 4 : 2}>
          {data.map((item, index) => (
            <Grid item xs={12} md={4} key={index} data-aos="fade-up">
              <DescriptionListIcon
                icon={
                  <div className={classes.iconCover}>
                    <NoSsr><i className={item.icon} /></NoSsr>
                  </div>
                }
                title={item.title}
                subtitle={item.subtitle}
              />
            </Grid>
          ))}
        </Grid>
        <Button
          color="primary"
          variant="contained"
          size="large"
          className={classes.cta}
        >
          get started
        </Button>
        </>
      </CardBase>
    </div>
  );
};

HowItWorks.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
  /**
   * Data to be rendered
   */
  data: PropTypes.array.isRequired,
};

export default HowItWorks;
