import React from 'react';
import PropTypes from 'prop-types';
import {
  makeStyles,
  List,
  ListItem,
  ListItemAvatar,
  Typography,
  Avatar,
} from '@material-ui/core';
import { SectionHeader } from 'components/molecules';

const useStyles = makeStyles(() => ({
  fontWeightBold: {
    fontWeight: 'bold',
  },
  checkBox: {
    background: 'transparent',
    borderRadius: 0,
    width: 30,
    height: 30,
  },
}));

const Features = ({ className, ...rest }) => {
  const classes = useStyles();

  return (
    <div className={className} {...rest}>
      <SectionHeader
        title="Features"
        subtitle="theFront landing page examples can be used out of the box, but since they’re built on flexible components, you can also create new pages all your own with ease. Copy-paste a section here, a component there, switch up a few variables, and you have an entirely new landing!"
        align="left"
        titleProps={{
          className: classes.fontWeightBold,
          color: 'textPrimary',
        }}
        subtitleProps={{
          color: 'textPrimary',
          variant: 'body1',
        }}
        disableGutter
      />
      <List>
        <ListItem disableGutters>
          <ListItemAvatar>
            <Avatar
              src="https://assets.maccarianagency.com/the-front/illustrations/check-icon-yellow.svg"
              className={classes.checkBox}
            />
          </ListItemAvatar>
          <Typography variant="body1" color="textPrimary">
            More than 45 pages, 300+ component reusable compositions and 30+ stand-alone components created by following the Atomic Design Methodology
          </Typography>
        </ListItem>
        <ListItem disableGutters>
          <ListItemAvatar>
            <Avatar
              src="https://assets.maccarianagency.com/the-front/illustrations/check-icon-yellow.svg"
              className={classes.checkBox}
            />
          </ListItemAvatar>
          <Typography variant="body1" color="textPrimary">
            create-react-app & react-scripts support. NextJS & GatsbyJS server side rendering support
          </Typography>
        </ListItem>
        <ListItem disableGutters>
          <ListItemAvatar>
            <Avatar
              src="https://assets.maccarianagency.com/the-front/illustrations/check-icon-yellow.svg"
              className={classes.checkBox}
            />
          </ListItemAvatar>
          <Typography variant="body1" color="textPrimary">
            Typescript support (available in Standard Plus & Extended licences)
          </Typography>
        </ListItem>
        <ListItem disableGutters>
          <ListItemAvatar>
            <Avatar
              src="https://assets.maccarianagency.com/the-front/illustrations/check-icon-yellow.svg"
              className={classes.checkBox}
            />
          </ListItemAvatar>
          <Typography variant="body1" color="textPrimary">
            Image lazy loading support. Animated sections on scroll. Swiper support
          </Typography>
        </ListItem>
        <ListItem disableGutters>
          <ListItemAvatar>
            <Avatar
              src="https://assets.maccarianagency.com/the-front/illustrations/check-icon-yellow.svg"
              className={classes.checkBox}
            />
          </ListItemAvatar>
          <Typography variant="body1" color="textPrimary">
            Fully responsive on all modern browsers. Figma and Sketch design files (available in Standard Plus & Extended licences)
          </Typography>
        </ListItem>
        <ListItem disableGutters>
          <ListItemAvatar>
            <Avatar
              src="https://assets.maccarianagency.com/the-front/illustrations/check-icon-yellow.svg"
              className={classes.checkBox}
            />
          </ListItemAvatar>
          <Typography variant="body1" color="textPrimary">
            Rich documentation with code samples and parameters/options
          </Typography>
        </ListItem>
        <ListItem disableGutters>
          <ListItemAvatar>
            <Avatar
              src="https://assets.maccarianagency.com/the-front/illustrations/check-icon-yellow.svg"
              className={classes.checkBox}
            />
          </ListItemAvatar>
          <Typography variant="body1" color="textPrimary">
            Free customer support & Free updates
          </Typography>
        </ListItem>
      </List>
    </div>
  );
};

Features.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
};

export default Features;
