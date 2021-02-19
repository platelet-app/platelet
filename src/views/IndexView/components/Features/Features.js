import React from 'react';
import PropTypes from 'prop-types';
import { Grid, colors, makeStyles } from '@material-ui/core';
import { SectionHeader, IconAlternate } from 'components/molecules';
import { CardBase, DescriptionListIcon } from 'components/organisms';

const useStyles = makeStyles(() => ({
  fontWeight900: {
    fontWeight: 900,
  },
}));

const data = [{
  icon: 'fas fa-cubes',
  color: colors.indigo,
  title: 'Atomic',
  subtitle: 'theFront follows atomic design methodologies for all components.',
}, {
  icon: 'fas fa-palette',
  color: colors.indigo,
  title: 'Theamable',
  subtitle: 'Customize any part of our components to match your design needs.',
}, {
  icon: 'fas fa-code',
  color: colors.indigo,
  title: 'Composable',
  subtitle: 'Designed with composition in mind. Compose new components with ease.',
}, {
  icon: 'fas fa-moon',
  color: colors.indigo,
  title: 'Light and Dark UI',
  subtitle: 'Optimized for multiple color modes. Use light or dark, your choice.',
}, {
  icon: 'fas fa-rocket',
  color: colors.indigo,
  title: 'Developer Experience',
  subtitle: 'Guaranteed to boost your productivity when building your app or website.',
}, {
  icon: 'fas fa-hand-holding-heart',
  color: colors.indigo,
  title: 'Continuous Updates',
  subtitle: 'We continually deploy improvements and new updates to theFront.',
}];

const Features = ({ className, ...rest }) => {
  const classes = useStyles();

  return (
    <div className={className} {...rest}>
      <SectionHeader
        title="An experience you'd expect from a design system"
        fadeUp
        titleProps={{
          variant: 'h3',
          color: 'textPrimary',
          className: classes.fontWeight900,
        }}
      />
      <Grid container spacing={2}>
        {data.map((adv, index) => (
          <Grid
            key={index}
            item
            container
            alignItems="center"
            direction="column"
            xs={6}
            md={4}
            data-aos="fade-up"
          >
            <CardBase
              liftUp
              variant="outlined"
              style={{ borderTop: `5px solid ${adv.color[500]}` }}
            >
              <DescriptionListIcon
                icon={
                  <IconAlternate
                    fontIconClass={adv.icon}
                    color={adv.color}
                    shape="circle"
                    size="small"
                  />
                }
                title={adv.title}
                subtitle={adv.subtitle}
                align="left"
              />
            </CardBase>
          </Grid>
        ))}
      </Grid>
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
