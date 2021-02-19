import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Typography, Grid, useMediaQuery, colors } from '@material-ui/core';
import { SectionHeader, IconAlternate } from 'components/molecules';
import { Section, DescriptionListIcon } from 'components/organisms';

const useStyles = makeStyles(() => ({
  noPaddingBottom: {
    paddingBottom: 0,
  },
  noPaddingTop: {
    paddingTop: 0,
  },
  fontWeight900: {
    fontWeight: 900,
  },
}));

const data = [
  {
    icon: 'fas fa-layer-group',
    title: 'Built for developers',
    subtitle:
      'TheFront is built to make your life easier. Variables, build tooling, documentation, and reusable components.',
  },
  {
    icon: 'fab fa-sketch',
    title: 'Designed to be modern',
    subtitle:
      'Designed with the latest design trends in mind. TheFront feels modern, minimal, and beautiful.',
  },
  {
    icon: 'fas fa-code',
    title: 'Documentation for everything',
    subtitle:
      "We've written extensive documentation for components and tools, so you never have to reverse engineer anything.",
  },
];

const Hero = props => {
  const { className, ...rest } = props;
  const classes = useStyles();
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  return (
    <div className={className} {...rest}>
      <Section className={classes.noPaddingBottom}>
        <SectionHeader
          title={
            <span>
              Welcome to{' '}
              <Typography component="span" variant="inherit" color="primary">theFront.</Typography>
              <br />
              <span>Develop anything your business needs.</span>
            </span>
          }
          subtitle="Build a beautiful, modern website with flexible, fully customizable, atomic Material UI components."
          align="center"
          disableGutter
          titleVariant="h2"
          titleProps={{ className: classes.fontWeight900 }}
        />
      </Section>
      <Section>
        <Grid container spacing={isMd ? 4 : 2}>
          {data.map((item, index) => (
            <Grid key={index} item xs={12} sm={4} data-aos={'fade-up'}>
              <DescriptionListIcon
                title={item.title}
                subtitle={item.subtitle}
                icon={
                  <IconAlternate
                    fontIconClass={item.icon}
                    size="medium"
                    color={colors.indigo}
                  />
                }
                align="left"
              />
            </Grid>
          ))}
        </Grid>
      </Section>
    </div>
  );
};

Hero.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
};

export default Hero;
