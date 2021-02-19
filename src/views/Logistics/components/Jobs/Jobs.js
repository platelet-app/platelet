import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@material-ui/core/styles';
import { useMediaQuery, Grid, Button } from '@material-ui/core';
import { SectionHeader } from 'components/molecules';
import { CardJobMinimal } from 'components/organisms';

const Jobs = props => {
  const { data, className, ...rest } = props;

  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  return (
    <div className={className} {...rest}>
      <SectionHeader
        title="We are hiring"
        subtitle="Keep track of what's happening with your data, change permissions, and run reports against your data anywhere in the world."
        subtitleColor="textPrimary"
        ctaGroup={[
          <Button color="primary" size="large" variant="contained">
            About the company
          </Button>,
        ]}
        data-aos="fade-up"
      />
      <Grid container spacing={isMd ? 4 : 2}>
        {data.map((item, index) => (
          <Grid item xs={12} key={index}>
            <CardJobMinimal
              title={item.title}
              subtitle={`${item.location} / ${item.type}`}
              showArrow
              titleProps={{
                variant: 'h6',
              }}
              subtitleProps={{
                variant: 'subtitle1',
              }}
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

Jobs.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
  /**
   * data to be rendered
   */
  data: PropTypes.array.isRequired,
};

export default Jobs;
