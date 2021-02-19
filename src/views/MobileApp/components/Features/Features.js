import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import {
  useMediaQuery,
  colors,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  Avatar,
} from '@material-ui/core';
import { Image } from 'components/atoms';
import { SectionHeader, IconAlternate } from 'components/molecules';

const useStyles = makeStyles(theme => ({
  listItemAvatar: {
    marginRight: theme.spacing(2),
  },
  coverImage: {
    [theme.breakpoints.down('sm')]: {
      maxWidth: 400,
    },
  },
  avatar: {
    width: 60,
    height: 60,
    marginLeft: theme.spacing(-2),
    border: `4px solid ${theme.palette.background.paper}`,
    boxShadow: `0 2px 10px 0 ${theme.palette.cardShadow}`,
    '&:first-child': {
      marginLeft: 0,
    },
  },
}));

const Features = props => {
  const { data, className, ...rest } = props;
  const classes = useStyles();

  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  const { items, people } = data;

  return (
    <div className={className} {...rest}>
      <Grid container spacing={isMd ? 4 : 2}>
        <Grid item xs={12}>
          <Grid container spacing={isMd ? 4 : 2}>
            <Grid
              item
              container
              justify="center"
              alignItems="center"
              xs={12}
              md={6}
              data-aos="fade-up"
            >
              <Image
                src="https://assets.maccarianagency.com/the-front/illustrations/businesswoman.svg"
                alt="..."
                className={classes.coverImage}
                lazy={false}
              />
            </Grid>
            <Grid item xs={12} md={6} data-aos="fade-up">
              <SectionHeader
                label="get connected"
                title={
                  <span>
                    <Typography color="secondary" variant="inherit" component="span">
                      Share your memories
                    </Typography>{' '}
                    with your travel buddies
                  </span>
                }
                subtitle="Don't listen to what they say go and see. Travelling with our app is easy. Join the biggest community of travellers."
                align="left"
                disableGutter
              />
              <List disablePadding>
                {items.map((item, index) => (
                  <ListItem key={index} disableGutters data-aos="fade-up">
                    <ListItemAvatar className={classes.listItemAvatar}>
                      <IconAlternate
                        size="small"
                        fontIconClass={item.icon}
                        color={colors.deepOrange}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={item.title}
                      secondary={item.subtitle}
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid
            container
            spacing={isMd ? 4 : 2}
            direction={isMd ? 'row' : 'column-reverse'}
          >
            <Grid item xs={12} md={6} data-aos="fade-up">
              <SectionHeader
                label="popular travellers"
                title={
                  <span>
                    <Typography color="secondary" variant="inherit" component="span">Know the people</Typography>{' '}
                    you are going to meet
                  </span>
                }
                subtitle="Don't listen to what they say go and see. Travelling with our app is easy. Join the biggest community of travellers."
                align="left"
                disableGutter
              />
              <List disablePadding>
                <ListItem disableGutters data-aos="fade-up">
                  <Typography variant="body1">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua.
                  </Typography>
                </ListItem>
                <ListItem disableGutters data-aos="fade-up">
                  {people.map((item, index) => (
                    <Avatar
                      key={index}
                      className={classes.avatar}
                      {...item.authorPhoto}
                    />
                  ))}
                </ListItem>
                <ListItem disableGutters data-aos="fade-up">
                  <Typography variant="body1">
                    Excepteur sint occaecat cupidatat non proident, sunt in
                    culpa qui officia deserunt mollit anim id est laborum.
                  </Typography>
                </ListItem>
              </List>
            </Grid>
            <Grid
              item
              container
              justify="center"
              alignItems="center"
              xs={12}
              md={6}
              data-aos="fade-up"
            >
              <Image
                src="https://assets.maccarianagency.com/the-front/illustrations/connected-world.svg"
                alt="..."
                className={classes.coverImage}
                lazy={false}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

Features.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
  /**
   * data to be rendered
   */
  data: PropTypes.object.isRequired,
};

export default Features;
