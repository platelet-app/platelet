import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import {
  useMediaQuery,
  colors,
  Grid,
  Typography,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
} from '@material-ui/core';
import { SectionHeader } from 'components/molecules';

const useStyles = makeStyles(theme => ({
  gridItem: {
    border: 0,
    [theme.breakpoints.up('sm')]: {
      borderRight: `1px solid ${colors.blueGrey[100]}`,
      '&:nth-child(2n)': {
        borderRight: 0,
      },
      '&:nth-child(-n+4)': {
        borderBottom: `1px solid ${colors.blueGrey[100]}`,
      },
    },
    [theme.breakpoints.up('md')]: {
      borderRight: `1px solid ${colors.blueGrey[100]}`,
      '&:nth-child(2n)': {
        borderRight: `1px solid ${colors.blueGrey[100]}`,
      },
      '&:nth-child(-n+4)': {
        borderBottom: 0,
      },
      '&:nth-child(3n)': {
        borderRight: 0,
      },
      '&:nth-child(-n+3)': {
        borderBottom: `1px solid ${colors.blueGrey[100]}`,
      },
    },
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
        title="Our customers are our biggest fans."
        subtitle="We dont' like to brag, but we don't mind letting our customers do it for us. Here are a few nice things folks have said about our themes over the years."
        align="center"
        data-aos="fade-up"
      />
      <Grid container spacing={isMd ? 4 : 2}>
        {data.map((item, index) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            key={index}
            className={classes.gridItem}
            data-aos="fade-up"
          >
            <Grid container spacing={0}>
              <Grid item xs={12}>
                <ListItem disableGutters key={index}>
                  <ListItemAvatar>
                    <Avatar {...item.authorPhoto} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={item.authorName}
                    secondary={item.authorOccupation}
                    primaryTypographyProps={{
                      variant: 'h6',
                    }}
                    secondaryTypographyProps={{
                      variant: 'body1',
                      noWrap: true,
                    }}
                  />
                </ListItem>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1">{item.feedback}</Typography>
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
