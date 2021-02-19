import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import {
  colors,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@material-ui/core';
import { Image } from 'components/atoms';
import { SectionHeader, IconAlternate } from 'components/molecules';
import { HeroShaped } from 'components/organisms';

const useStyles = makeStyles(theme => ({
  root: {
    '& .hero-shaped': {
      borderBottom: 0,
    },
  },
  sectionHeader: {
    maxWidth: '100%',
    padding: theme.spacing(0, 2),
  },
  cover: {
    position: 'relative',
    zIndex: 9,
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    background:
      'url(https://assets.maccarianagency.com/the-front/illustrations/patterns-bg.svg) no-repeat left bottom',
    backgroundSize: 'contain',
  },
  image: {
    objectFit: 'contain',
    width: 'auto',
    maxWidth: '100%',
  },
  listItemAvatar: {
    marginRight: theme.spacing(1),
    marginTop: theme.spacing(1),
    alignSelf: 'flex-start',
    [theme.breakpoints.up('md')]: {
      marginRight: theme.spacing(4),
    },
  },
  title: {
    fontWeight: 'bold',
  },
}));

const Trucking = props => {
  const { data, className, ...rest } = props;
  const classes = useStyles();

  return (
    <div className={clsx(classes.root, className)} {...rest}>
      <SectionHeader
        title="Trucking"
        subtitle="Decision problems faced by less than truckload (LTL) companies are highly complex."
        className={classes.sectionHeader}
        data-aos="fade-up"
      />
      <HeroShaped
        leftSide={
          <List disablePadding>
            {data.map((item, index) => (
              <ListItem disableGutters key={index} data-aos="fade-up">
                <ListItemAvatar className={classes.listItemAvatar}>
                  <IconAlternate
                    size="small"
                    fontIconClass={item.icon}
                    color={colors.blue}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={item.title}
                  secondary={item.subtitle}
                  primaryTypographyProps={{
                    variant: 'h6',
                    className: classes.title,
                    gutterBottom: true,
                  }}
                  secondaryTypographyProps={{
                    variant: 'subtitle1',
                    color: 'textPrimary',
                  }}
                />
              </ListItem>
            ))}
          </List>
        }
        rightSide={
          <div className={classes.cover}>
            <Image
              src="https://assets.maccarianagency.com/the-front/illustrations/macbook-dashboard.png"
              className={classes.image}
              lazy={false}
            />
          </div>
        }
      />
    </div>
  );
};

Trucking.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
  /**
   * Data to be rendered
   */
  data: PropTypes.array.isRequired,
};

export default Trucking;
