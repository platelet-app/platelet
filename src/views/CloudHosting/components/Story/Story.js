import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@material-ui/core/styles';
import { Grid, Button, useMediaQuery, colors } from '@material-ui/core';
import { Icon } from 'components/atoms';
import { SectionHeader } from 'components/molecules';
import { DescriptionListIcon } from 'components/organisms';

const Story = props => {
  const { className, ...rest } = props;

  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  return (
    <div className={className} {...rest}>
      <SectionHeader title="Who we are" label="Our Story" data-aos="fade-up" />
      <Grid container spacing={isMd ? 4 : 2}>
        <Grid item xs={12} sm={6} data-aos={'fade-up'}>
          <DescriptionListIcon
            title="Who are we?"
            subtitle="Our sign up is dead simple. We only require your basic company information and what type of data storage you want. Our sign up is dead simple. We only require your basic company information and what type of data storage you want."
            icon={
              <Icon
                fontIconClass="fas fa-book"
                size="medium"
                fontIconColor={colors.yellow[700]}
              />
            }
            align="left"
          />
        </Grid>
        <Grid item xs={12} sm={6} data-aos={'fade-up'}>
          <DescriptionListIcon
            title="What’s up with the name?"
            subtitle="We support bulk uploading via SQL, integrations with most data storage products, or you can use our API. Simply select where you'd like to transfer your data and we'll being the process of migrating it instantly."
            icon={
              <Icon
                fontIconClass="fas fa-briefcase"
                size="medium"
                fontIconColor={colors.yellow[700]}
              />
            }
            align="left"
          />
        </Grid>
        <Grid item container justify="center" xs={12} data-aos={'fade-up'}>
          <Button variant="outlined" color="primary">
            Learn more
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

Story.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
};

export default Story;
