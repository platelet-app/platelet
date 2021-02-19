import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { colors, Typography, Grid } from '@material-ui/core';
import { Image } from 'components/atoms';
import { CardProduct } from 'components/organisms';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 2),
    border: `1px solid ${colors.grey[200]}`,
    borderRadius: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(3),
    },
  },
  gridItem: {
    marginBottom: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    borderBottom: `1px solid ${colors.grey[200]}`,
    '&:last-child': {
      marginBottom: 0,
      borderBottom: 0,
      paddingBottom: 0,
    },
  },
  cardProduct: {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    boxShadow: 'none',
    borderRadius: 0,
    '& .card-product__content': {
      padding: 0,
      paddingLeft: theme.spacing(2),
    },
    '& .card-product__media': {
      height: 90,
      width: 90,
      '& img': {
        height: 90,
        width: 90,
      },
    },
  },
  image: {
    objectFit: 'cover',
  },
  blogContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: '100%',
  },
  blogTitle: {
    fontWeight: 700,
  },
  tags: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  tag: {
    margin: theme.spacing(0, 1 / 2, 1 / 2, 0),
    textTransform: 'uppercase',
    fontWeight: 700,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      marginBottom: theme.spacing(3),
    },
  },
}));

const SidebarArticles = props => {
  const { data, className, ...rest } = props;
  const classes = useStyles();

  const BlogMediaContent = props => (
    <Image
      {...props}
      className={classes.image}
      lazyProps={{ width: '100%', height: '100%' }}
    />
  );

  const BlogContent = props => (
    <div className={classes.blogContent}>
      <div className={classes.tags}>
        {props.tags.map((item, index) => (
          <Typography
            variant="caption"
            color="primary"
            className={classes.tag}
            key={index}
          >
            {item}
          </Typography>
        ))}
      </div>
      <Typography
        variant="body2"
        color="textPrimary"
        className={classes.blogTitle}
        gutterBottom
      >
        {props.title}
      </Typography>
      <Typography variant="caption" color="textPrimary">
        <i>
          {props.author.name} - {props.date}
        </i>
      </Typography>
    </div>
  );

  return (
    <div className={clsx(classes.root, className)} {...rest}>
      <Typography
        variant="h6"
        color="textPrimary"
        gutterBottom
        className={classes.sectionTitle}
      >
        Upcoming updates
      </Typography>
      <Grid container spacing={0}>
        {data.map((item, index) => (
          <Grid
            item
            xs={12}
            key={index}
            data-aos="fade-up"
            className={classes.gridItem}
          >
            <CardProduct
              className={classes.cardProduct}
              mediaContent={
                <BlogMediaContent {...item.cover} alt={item.title} />
              }
              cardContent={
                <BlogContent
                  title={item.title}
                  subtitle={item.subtitle}
                  author={item.author}
                  date={item.date}
                  tags={item.tags}
                />
              }
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

SidebarArticles.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
  /**
   * data to be rendered
   */
  data: PropTypes.array.isRequired,
};

export default SidebarArticles;
