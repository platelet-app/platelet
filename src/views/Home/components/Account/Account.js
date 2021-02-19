import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';
import { Image } from 'components/atoms';
import { SectionHeader } from 'components/molecules';
import { CardBase } from 'components/organisms';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

const useStyles = makeStyles(theme => ({
  cardBase: {
    height: 'auto',
    '& .card-base__content': {
      padding: 0,
      height: 'auto',
    },
  },
  linkContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(2),
    borderTop: `1px solid ${theme.palette.background.level2}`,
  },
  title: {
    fontWeight: 'bold',
  },
}));

const Account = ({ themeMode = 'light', data, className, ...rest }) => {
  const classes = useStyles();
  return (
    <div className={className} {...rest}>
      <SectionHeader
        title="Account Pages"
        subtitle="These pages are used for basic authentication management."
        align="left"
      />
      <Grid container spacing={4}>
        {data.map((item, index) => (
          <Grid item xs={12} sm={6} key={index} data-aos="fade-up">
            <a href={item.href} title={item.title}>
              <CardBase withShadow liftUp className={classes.cardBase}>
                <>
                <Image
                  src={themeMode === 'light' ? item.cover : item.coverDark}
                  alt={item.title}
                />
                <div className={classes.linkContainer}>
                  <Typography
                    variant="subtitle1"
                    color="textPrimary"
                    className={classes.title}
                  >
                    {item.title}
                  </Typography>
                  <ChevronRightIcon />
                </div>
                </>
              </CardBase>
            </a>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

Account.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
  /**
   * data to be rendered
   */
  data: PropTypes.array.isRequired,
  /**
   * Current theme mode
   */
  themeMode: PropTypes.string,
};

export default Account;
