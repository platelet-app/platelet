import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import {
  useMediaQuery,
  colors,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  NoSsr,
} from '@material-ui/core';
import { SectionHeader } from 'components/molecules';

const useStyles = makeStyles(theme => ({
  card: {
    boxShadow: '0 7px 14px 0 rgba(0, 0, 0, 0.1)',
  },
  cardMedia: {
    minHeight: 280,
    position: 'relative',
    display: 'flex',
    alignItems: 'flex-end',
  },
  pricingContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(3),
    width: '100%',
  },
  cardCta: {
    padding: theme.spacing(1 / 2, 1),
    background: theme.palette.background.paper,
    borderRadius: theme.spacing(1 / 2),
  },
  listItem: {
    padding: 0,
  },
  listItemIcon: {
    minWidth: theme.spacing(3),
    '& i': {
      color: colors.blueGrey[500],
    },
  },
  fontWeight500: {
    fontWeight: 500,
  },
  propertyList: {
    display: 'flex',
  },
  pin: {
    color: `${colors.deepOrange[500]} !important`,
  },
  divider: {
    margin: theme.spacing(3, 0, 2, 0),
  },
}));

const FeaturedProperties = props => {
  const { data, className, ...rest } = props;
  const classes = useStyles();

  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  return (
    <div className={className} {...rest}>
      <SectionHeader
        title="Featured properties"
        subtitle="After 3 days all of your offers will arrive and you will have another 7 days to select your new company."
        data-aos="fade-up"
      />
      <Grid container spacing={isMd ? 4 : 2}>
        {data.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index} data-aos="fade-up">
            <Card className={classes.card}>
              <CardMedia
                className={classes.cardMedia}
                image={item.image.src}
                {...item.image}
              >
                <div className={classes.pricingContainer}>
                  <div className={classes.cardCta}>
                    <Typography color="primary" variant="subtitle1">
                      {item.price}
                    </Typography>
                  </div>
                  <div className={classes.cardCta}>
                    <Typography color="primary" variant="subtitle1">
                      <NoSsr><i className="far fa-heart" /></NoSsr>
                    </Typography>
                  </div>
                </div>
              </CardMedia>
              <CardContent>
                <List disablePadding>
                  <ListItem disableGutters>
                    <ListItemIcon className={classes.listItemIcon}>
                      <NoSsr>
                        <i
                          className={clsx('fas fa-map-marker-alt', classes.pin)}
                        />
                      </NoSsr>
                    </ListItemIcon>
                    <ListItemText primary={item.location} />
                  </ListItem>
                </List>
                <Typography
                  color="textPrimary"
                  variant="subtitle1"
                  className={classes.fontWeight500}
                >
                  {item.address}
                </Typography>
                <Divider className={classes.divider} />
                <Grid container>
                  <Grid item xs={6}>
                    <List disablePadding>
                      <ListItem disableGutters className={classes.listItem}>
                        <ListItemIcon className={classes.listItemIcon}>
                          <NoSsr><i className="fas fa-home" /></NoSsr>
                        </ListItemIcon>
                        <ListItemText primary={item.size} />
                      </ListItem>
                    </List>
                  </Grid>
                  <Grid item xs={6}>
                    <List disablePadding className={classes.propertyList}>
                      <ListItem disableGutters className={classes.listItem}>
                        <ListItemIcon className={classes.listItemIcon}>
                          <NoSsr><i className="fas fa-parking" /></NoSsr>
                        </ListItemIcon>
                        <ListItemText primary={item.garages} />
                      </ListItem>
                      <ListItem disableGutters className={classes.listItem}>
                        <ListItemIcon className={classes.listItemIcon}>
                          <NoSsr><i className="fas fa-bath" /></NoSsr>
                        </ListItemIcon>
                        <ListItemText primary={item.baths} />
                      </ListItem>
                      <ListItem disableGutters className={classes.listItem}>
                        <ListItemIcon className={classes.listItemIcon}>
                          <NoSsr><i className="fas fa-door-open" /></NoSsr>
                        </ListItemIcon>
                        <ListItemText primary={item.rooms} />
                      </ListItem>
                    </List>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
        <Grid item xs={12} container justify="center" data-aos="fade-up">
          <Button variant="outlined" color="primary">
            See all list
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

FeaturedProperties.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
  /**
   * data to be rendered
   */
  data: PropTypes.array.isRequired,
};

export default FeaturedProperties;
