import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import {
  useMediaQuery,
  Grid,
  ListItem,
  ListItemAvatar,
  Typography,
  Avatar,
  colors,
} from '@material-ui/core';
import { SectionHeader, IconAlternate } from 'components/molecules';

const useStyles = makeStyles(theme => ({
  listItemAvatar: {
    minWidth: 28,
  },
  listItem: {
    [theme.breakpoints.up('sm')]: {
      justifyContent: 'center',
    },
  },
  galleryMedia: {
    width: 80,
    height: 80,
    marginLeft: theme.spacing(-2),
    border: `3px solid ${theme.palette.background.paper}`,
    '&:first-child': {
      marginLeft: 0,
    },
    [theme.breakpoints.up('sm')]: {
      width: 100,
      height: 100,
    },
    [theme.breakpoints.up('md')]: {
      width: 140,
      height: 140,
    },
  },
}));

const Contact = props => {
  const { data, className, ...rest } = props;
  const classes = useStyles();

  const { items, team } = data;

  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  return (
    <div className={className} {...rest}>
      <Grid container spacing={isMd ? 4 : 2}>
        <Grid item xs={12}>
          <SectionHeader
            label="support team"
            title={
              <>
                <span>
                  Our friendly support team
                  <Typography color="secondary" variant="inherit" component="span">
                    {' '}
                    will help you with anything.
                  </Typography>
                </span>
              </>
            }
            subtitle="We aim to take care of you. Need help with installation, find a bug, or just need a clarifiction about our documentation? We'll be there to lend a helping hand."
            align="center"
            disableGutter
          />
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={0}>
            {items.map((item, index) => (
              <Grid item container xs={6} sm={3} key={index} data-aos="fade-up">
                <ListItem disableGutters className={classes.listItem}>
                  <ListItemAvatar className={classes.listItemAvatar}>
                    <IconAlternate
                      size="extraSmall"
                      shape="circle"
                      fontIconClass="fas fa-check"
                      color={colors.deepOrange}
                    />
                  </ListItemAvatar>
                  <Typography variant="subtitle1" color="secondary" noWrap>
                    {item}
                  </Typography>
                </ListItem>
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid
          item
          container
          alignItems="center"
          justify="center"
          xs={12}
          data-aos="fade-up"
        >
          {team.map((item, index) => (
            <Avatar
              key={index}
              className={classes.galleryMedia}
              alt={item.authorName}
              {...item.authorPhoto}
            />
          ))}
        </Grid>
      </Grid>
    </div>
  );
};

Contact.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
  /**
   * Data to render
   */
  data: PropTypes.object.isRequired,
};

export default Contact;
