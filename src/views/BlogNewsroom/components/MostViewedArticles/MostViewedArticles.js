import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { colors, Button, Typography, Grid } from '@material-ui/core';
import { Image, LearnMoreLink } from 'components/atoms';
import { DescriptionCta } from 'components/molecules';
import { CardProduct } from 'components/organisms';

const useStyles = makeStyles(theme => ({
  root: {
    [theme.breakpoints.down('xs')]: {
      marginLeft: theme.spacing(-2),
      marginRight: theme.spacing(-2),
    },
  },
  gridItem: {
    marginBottom: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      marginBottom: theme.spacing(3),
      paddingBottom: theme.spacing(3),
      borderBottom: `1px solid ${colors.grey[200]}`,
    },
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
    borderRadius: 0,
    boxShadow: 'none',
    background: 'transparent',
    '& .card-product__content': {
      padding: theme.spacing(2, 2, 0, 2),
      [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(0, 0, 0, 2),
      },
    },
    '& .card-product__media': {
      [theme.breakpoints.up('sm')]: {
        height: 170,
        width: 170,
        '& img': {
          height: 170,
          width: 170,
        },
      },
    },
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column !important',
      '& .card-product__content': {
        flex: '1 1 100%',
      },
      '& .card-product__media': {
        flex: '1 1 100%',
        width: '100%',
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
  button: {
    marginTop: theme.spacing(1),
    alignSelf: 'flex-start',
  },
  blogTitle: {
    fontWeight: 700,
  },
  author: {
    margin: theme.spacing(1, 0),
  },
  title: {
    fontWeight: 'bold',
  },
  descriptionCta: {
    maxWidth: '100%',
    marginBottom: theme.spacing(3),
    padding: theme.spacing(0, 2),
    [theme.breakpoints.up('md')]: {
      marginBottom: theme.spacing(4),
      padding: 0,
    },
    [theme.breakpoints.up('sm')]: {
      padding: 0,
    },
  },
}));

const MostViewedArticles = props => {
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
      <Typography
        variant="h6"
        color="textPrimary"
        className={classes.blogTitle}
      >
        {props.title}
      </Typography>
      <Typography
        variant="body2"
        color="textPrimary"
        className={classes.author}
      >
        <i>
          {props.author.name} - {props.date}
        </i>
      </Typography>
      <Typography variant="subtitle1" color="textPrimary">
        {props.subtitle}
      </Typography>
      <LearnMoreLink
        title={'Learn more'}
        variant="body1"
        className={classes.button}
      />
    </div>
  );

  return (
    <div className={clsx(classes.root, className)} {...rest}>
      <DescriptionCta
        title="Most viewed"
        primaryCta={
          <Button variant="outlined" color="primary" size="large">
            View all
          </Button>
        }
        align={'left'}
        titleProps={{
          variant: 'h4',
          color: 'textPrimary',
          className: classes.title,
          noWrap: false,
        }}
        className={classes.descriptionCta}
        data-aos="fade-up"
      />
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

MostViewedArticles.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
  /**
   * data to be rendered
   */
  data: PropTypes.array.isRequired,
};

export default MostViewedArticles;
