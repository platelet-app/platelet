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
  icon: 'fas fa-file-invoice',
  color: colors.indigo,
  title: 'Reporting',
  subtitle: 'Instantly generate reports and statistical data.',
}, {
  icon: 'fas fa-user-friends',
  color: colors.indigo,
  title: 'Relays',
  subtitle: 'Coordinate relays with your members and other groups.',
}, {
  icon: 'fas fa-mobile-alt',
  color: colors.indigo,
  title: 'Use anywhere',
  subtitle: 'Developed with standard web technology. Connect from any internet connected device.',
}, {
  icon: 'fas fa-moon',
  color: colors.indigo,
  title: 'Themeable',
  subtitle: 'Switch between light and dark mode.',
}, {
  icon: 'fas fa-rocket',
  color: colors.indigo,
  title: 'Real time',
  subtitle: 'Updates and notifications are pushed instantly to your dashboard.',
}, {
  icon: 'fas fa-code',
  color: colors.indigo,
  title: 'As a platform',
  subtitle: 'Integrate the platelet API into your own scripts and tools.',
}];

const Features = ({ className, ...rest }) => {
  const classes = useStyles();

  return (
    <div className={className} {...rest}>
      <SectionHeader
        title={""}
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
