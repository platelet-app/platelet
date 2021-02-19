import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import {
  useMediaQuery,
  Grid,
  Button,
  Card,
  CardMedia,
  CardContent,
  Typography,
} from '@material-ui/core';
import { Image } from 'components/atoms';
import { SectionHeader } from 'components/molecules';
import { CardBase } from 'components/organisms';

const useStyles = makeStyles(theme => ({
  textWhite: {
    color: 'white',
  },
  cardMedia: {
    height: 180,
  },
  card: {
    display: 'flex',
    boxShadow: 'none',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
    },
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  cardHighlighted: {
    background: theme.palette.primary.dark,
  },
  image: {
    objectFit: 'cover',
  },
}));

const News = props => {
  const { data, className, ...rest } = props;
  const classes = useStyles();

  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  return (
    <div className={className} {...rest}>
      <SectionHeader
        title="Our latest news"
        subtitle="After 3 days all of your offers will arrive and you will have another 7 days to select your new company."
        data-aos="fade-up"
      />
      <Grid container spacing={isMd ? 4 : 2}>
        <Grid item xs={12} md={8}>
          <Grid container spacing={isMd ? 4 : 2} direction="column">
            {data.map((item, index) => (
              <Grid item xs={12} key={index} data-aos="fade-up">
                <Card className={classes.card}>
                  <CardMedia className={classes.cardMedia}>
                    <Image
                      {...item.cover}
                      alt={item.title}
                      className={classes.image}
                      lazyProps={{
                        width: '100%',
                        height: '100%',
                      }}
                    />
                  </CardMedia>
                  <CardContent className={classes.cardContent}>
                    <Typography variant="subtitle1" color="textSecondary">
                      {item.tag}
                    </Typography>
                    <Typography variant="h6" color="textPrimary">
                      {item.title}
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                      {item.date}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid item xs={12} md={4}>
          <Grid container spacing={isMd ? 4 : 2} direction="column">
            <Grid item xs={12} data-aos="fade-up">
              <CardBase withShadow className={classes.cardHighlighted}>
                <SectionHeader
                  title={
                    <span className={classes.textWhite}>
                      You like what you’re reading?
                    </span>
                  }
                  titleVariant="h6"
                  subtitle={
                    <span className={classes.textWhite}>
                      Get free online programing tips and resources delivered
                      directly to your inbox.
                    </span>
                  }
                  subtitleVariant="body1"
                  ctaGroup={[<Button variant="contained">get started</Button>]}
                  disableGutter
                  align="left"
                />
              </CardBase>
            </Grid>
            <Grid item xs={12} data-aos="fade-up">
              <CardBase withShadow>
                <SectionHeader
                  title="Interactive decision support system"
                  titleVariant="h6"
                  ctaGroup={[
                    <Button variant="contained" color="primary">
                      get started
                    </Button>,
                  ]}
                  disableGutter
                  align="left"
                />
              </CardBase>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

News.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
  /**
   * data to be rendered
   */
  data: PropTypes.array.isRequired,
};

export default News;
