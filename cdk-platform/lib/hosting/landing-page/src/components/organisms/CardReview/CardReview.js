import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
  Grid,
  Avatar,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@material-ui/core';
import { CardBase } from 'components/organisms';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    width: '100%',
  },
}));

/**
 * Component to display the review card
 *
 * @param {Object} props
 */
const CardReview = props => {
  const {
    icon,
    text,
    authorPhoto,
    authorName,
    authorTitle,
    align,
    textVariant,
    className,
    textProps,
    listItemPrimaryTypographyProps,
    listItemSecondaryTypographyProps,
    ...rest
  } = props;

  const classes = useStyles();

  let justifyGrid = 'center';
  if (align === 'left') {
    justifyGrid = 'flex-start';
  } else if (align === 'right') {
    justifyGrid = 'flex-end';
  }

  return (
    <CardBase
      className={clsx('card-review', classes.root, className)}
      {...rest}
    >
      <Grid container spacing={2} className="card-review__wrapper">
        <Grid
          item
          container
          justify={justifyGrid}
          xs={12}
          className="card-review__icon-wrapper"
        >
          {icon}
        </Grid>
        <Grid item xs={12} className="card-review__text-wrapper">
          <Typography
            variant={textVariant}
            align={align}
            component="p"
            {...textProps}
          >
            {text}
          </Typography>
        </Grid>
        <Grid item xs={12} className="card-review__lits-container">
          <Grid
            container
            justify={justifyGrid}
            className="card-review__list-wrapper"
          >
            <List disablePadding className="card-review__list">
              <ListItem className="card-review__list-item">
                <ListItemAvatar className="card-review__list-item-avatar">
                  <Avatar
                    {...authorPhoto}
                    alt={authorName}
                    className="card-review__avatar"
                  />
                </ListItemAvatar>
                <ListItemText
                  className="card-review__list-item-text"
                  primary={authorName}
                  secondary={authorTitle}
                  primaryTypographyProps={{
                    ...listItemPrimaryTypographyProps,
                  }}
                  secondaryTypographyProps={{
                    ...listItemSecondaryTypographyProps,
                  }}
                />
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </Grid>
    </CardBase>
  );
};

CardReview.defaultProps = {
  align: 'center',
  textVariant: 'h6',
  textProps: {},
  listItemPrimaryTypographyProps: {},
  listItemSecondaryTypographyProps: {},
};

CardReview.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
  /**
   * Icon to show inside the review card
   */
  icon: PropTypes.node.isRequired,
  /**
   * Review text to show inside the review card
   */
  text: PropTypes.string.isRequired,
  /**
   * Reviewer photo to show inside the review card.Should be an object with src and srcSet properties
   */
  authorPhoto: PropTypes.object.isRequired,
  /**
   * Reviewer name to show inside the review card
   */
  authorName: PropTypes.string.isRequired,
  /**
   * Reviewer title to show inside the review card
   */
  authorTitle: PropTypes.string,
  /**
   * Alignment of the content
   */
  align: PropTypes.oneOf(['left', 'right', 'center']),
  /**
   * Review text variant
   */
  textVariant: PropTypes.string,
  /**
   * Additional props to pass to the text Typography component
   */
  textProps: PropTypes.object,
  /**
   * Additional props to pass to the list item primary text Typography component
   */
  listItemPrimaryTypographyProps: PropTypes.object,
  /**
   * Additional props to pass to the list item secondary text Typography component
   */
  listItemSecondaryTypographyProps: PropTypes.object,
};

export default CardReview;
