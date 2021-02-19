import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import {
  useMediaQuery,
  colors,
  Grid,
  Avatar,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@material-ui/core';
import { SectionHeader, IconAlternate } from 'components/molecules';

const useStyles = makeStyles(theme => ({
  swiperContainer: {
    width: '100%',
    maxWidth: 500,
  },
  gridItem: {
    width: '100% !important',
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
    <div className={className} data-aos="fade-up" {...rest}>
      <SectionHeader
        data-aos="fade-up"
        title="Take a look what our customers say"
        subtitle="Take a quick glance at some of our past projects. If you would like to see some more great work, get in touch with us to take a look at our private portfolio."
      />
      <Grid container spacing={isMd ? 4 : 2}>
        {data.map((item, index) => (
          <Grid item xs={12} sm={12} md={4} key={index} data-aos="fade-up">
            <Grid container spacing={2} className={classes.gridItem}>
              <Grid item container justify="center" xs={12}>
                <IconAlternate
                  color={colors.indigo}
                  fontIconClass="fas fa-quote-right"
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" align="center" component="p">
                  {item.feedback}
                </Typography>
              </Grid>
              <div style={{ flexGrow: 1 }} />
              <Grid item xs={12}>
                <Grid container justify="center">
                  <List disablePadding>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar {...item.authorPhoto} alt={item.authorName} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={item.authorName}
                        secondary={item.authorTitle}
                      />
                    </ListItem>
                  </List>
                </Grid>
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
