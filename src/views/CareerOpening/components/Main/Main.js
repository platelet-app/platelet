import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import {
  useMediaQuery,
  Grid,
  Typography,
  Divider,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
} from '@material-ui/core';
import { SectionHeader, DescriptionCta } from 'components/molecules';
import { CardBase } from 'components/organisms';

const useStyles = makeStyles(theme => ({
  root: {
    '& .description-cta__button-group': {
      flexWrap: 'nowrap',
    },
  },
  title: {
    fontWeight: 'bold',
  },
  divider: {
    margin: theme.spacing(3, 0),
    [theme.breakpoints.up('md')]: {
      margin: theme.spacing(5, 0),
    },
  },
  textWhite: {
    color: 'white',
  },
  cardHighlighted: {
    background: theme.palette.primary.dark,
  },
  checkBox: {
    background: 'transparent',
    borderRadius: 0,
  },
  list: {
    marginBottom: theme.spacing(3),
    [theme.breakpoints.up('md')]: {
      marginBottom: theme.spacing(4),
    },
  },
}));

const Main = props => {
  const { data, className, ...rest } = props;
  const classes = useStyles();

  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  return (
    <div className={clsx(classes.root, className)} {...rest}>
      <DescriptionCta
        title="UX /UI Designer"
        subtitle="San Francisco, CA · Full time"
        primaryCta={
          <Button variant="outlined" color="primary" size="large">
            Refer a friend
          </Button>
        }
        secondaryCta={
          <Button variant="contained" color="primary" size="large">
            Apply now
          </Button>
        }
        align={'left'}
        titleProps={{
          variant: 'h3',
          className: classes.title,
          color: 'textPrimary',
        }}
        subtitleProps={{
          color: 'textPrimary',
        }}
      />
      <Divider className={classes.divider} />
      <Grid container spacing={isMd ? 4 : 2}>
        <Grid item xs={12} md={8}>
          <SectionHeader
            title="Who we are"
            subtitle="We believe lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus feugiat elit vitae enim lacinia semper. Cras nulla lectus, porttitor vitae urna iaculis, malesuada tincidunt lectus. Proin nec tellus sit amet massa auctor imperdiet id vitae diam. Aenean gravida est nec diam suscipit iaculis. Praesent urna velit, auctor nec turpis et, vehicula lobortis sem. Vivamus convallis mi sagittis eleifend laoreet. Praesent vitae venenatis enim. Nulla tincidunt felis et lectus rhoncus laoreet."
            align="left"
            data-aos="fade-up"
            titleProps={{
              className: classes.title,
              color: 'textPrimary',
            }}
            subtitleProps={{
              variant: 'body1',
              color: 'textPrimary',
            }}
          />
          <SectionHeader
            title="What we’re looking for"
            subtitle="Aenean gravida est nec diam suscipit iaculis. Praesent urna velit, auctor nec turpis et, vehicula lobortis sem. Vivamus convallis mi sagittis eleifend laoreet. Praesent vitae venenatis enim. Nulla tincidunt felis et lectus rhoncus laoreet."
            align="left"
            data-aos="fade-up"
            titleProps={{
              className: classes.title,
              color: 'textPrimary',
            }}
            subtitleProps={{
              variant: 'body1',
              color: 'textPrimary',
            }}
            disableGutter
          />
          <List className={classes.list}>
            {data.map((item, index) => (
              <ListItem disableGutters key={index} data-aos="fade-up">
                <ListItemAvatar>
                  <Avatar
                    src="https://assets.maccarianagency.com/the-front/illustrations/check-icon-yellow.svg"
                    className={classes.checkBox}
                  />
                </ListItemAvatar>
                <Typography variant="body1" color="textPrimary">
                  {item}
                </Typography>
              </ListItem>
            ))}
          </List>
          <SectionHeader
            title="Why to apply"
            subtitle="We believe lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus feugiat elit vitae enim lacinia semper. Cras nulla lectus, porttitor vitae urna iaculis, malesuada tincidunt lectus. Proin nec tellus sit amet massa auctor imperdiet id vitae diam. Aenean gravida est nec diam suscipit iaculis. Praesent urna velit, auctor nec turpis et, vehicula lobortis sem. Vivamus convallis mi sagittis eleifend laoreet. Praesent vitae venenatis enim. Nulla tincidunt felis et lectus rhoncus laoreet."
            align="left"
            data-aos="fade-up"
            titleProps={{
              className: classes.title,
              color: 'textPrimary',
            }}
            subtitleProps={{
              variant: 'body1',
              color: 'textPrimary',
            }}
            disableGutter
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Grid container spacing={isMd ? 4 : 2} direction="column">
            <Grid item xs={12} data-aos="fade-up">
              <CardBase withShadow className={classes.cardHighlighted}>
                <SectionHeader
                  title="Know about company"
                  subtitle="Get free online programing tips and resources delivered directly to your inbox."
                  ctaGroup={[<Button variant="contained">learn more</Button>]}
                  disableGutter
                  align="left"
                  titleProps={{
                    variant: 'h6',
                    className: classes.textWhite,
                  }}
                  subtitleProps={{
                    variant: 'body1',
                    className: classes.textWhite,
                  }}
                />
              </CardBase>
            </Grid>
            <Grid item xs={12} data-aos="fade-up">
              <CardBase withShadow>
                <SectionHeader
                  title="Don't see a job for you?"
                  titleVariant="h6"
                  subtitle="Get free online programing tips and resources delivered directly to your inbox."
                  ctaGroup={[
                    <Button variant="contained" color="primary">
                      See other vacances
                    </Button>,
                  ]}
                  disableGutter
                  align="left"
                  subtitleProps={{
                    variant: 'body1',
                  }}
                />
              </CardBase>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

Main.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
  /**
   * data to be rendered
   */
  data: PropTypes.array.isRequired,
};

export default Main;
