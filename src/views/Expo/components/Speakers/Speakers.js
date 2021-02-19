import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useMediaQuery, Grid, Button, Avatar } from '@material-ui/core';
import { LearnMoreLink } from 'components/atoms';
import { SectionHeader } from 'components/molecules';

const useStyles = makeStyles(theme => ({
  webinarAvatar: {
    width: 200,
    height: 200,
    border: `${theme.spacing(1)}px solid ${theme.palette.background.paper}`,
    boxShadow: `0 2px 10px 0 ${theme.palette.cardShadow}`,
    borderRadius: theme.spacing(2),
  },
  listGrid: {
    overflow: 'hidden',
    marginBottom: theme.spacing(3),
    '&:last-child': {
      marginBottom: theme.spacing(0),
    },
  },
}));

const Speakers = props => {
  const { data, className, ...rest } = props;
  const classes = useStyles();

  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  return (
    <div className={className} {...rest}>
      <SectionHeader
        title="Meet Our Speakers"
        subtitle="Book a place to participate to the upcoming webinars organised by our top management team."
        ctaGroup={[
          <LearnMoreLink
            title="See all speakers"
            variant="h6"
            color="primary"
          />,
        ]}
        fadeUp
      />
      <Grid container justify="center">
        {data.map((item, index) => (
          <Grid
            key={index}
            item
            container
            data-aos={'fade-up'}
            justify="space-between"
            spacing={isMd ? 4 : 2}
            className={classes.listGrid}
            direction="row-reverse"
          >
            <Grid item xs={12} sm={12} md={8}>
              <SectionHeader
                label={item.authorName}
                titleVariant="h5"
                title={item.title}
                subtitle={item.description}
                ctaGroup={[
                  <Button
                    variant="contained"
                    color="primary"
                    size={isMd ? 'large' : 'medium'}
                    fullWidth
                  >
                    Book now
                  </Button>,
                  <Button
                    variant="outlined"
                    color="primary"
                    size={isMd ? 'large' : 'medium'}
                    fullWidth
                  >
                    Learn More
                  </Button>,
                ]}
                align={isMd ? 'left' : 'center'}
                disableGutter
              />
            </Grid>
            <Grid
              item
              container
              xs={12}
              sm={12}
              md={4}
              justify={isMd ? 'flex-end' : 'center'}
              alignItems="center"
            >
              <Avatar
                {...item.authorPhoto}
                alt={item.authorName}
                className={classes.webinarAvatar}
              />
            </Grid>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

Speakers.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
  /**
   * data to be rendered
   */
  data: PropTypes.array.isRequired,
};

export default Speakers;
