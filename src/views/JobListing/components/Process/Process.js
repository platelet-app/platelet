import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Button, colors } from '@material-ui/core';
import { SectionHeader, IconAlternate } from 'components/molecules';
import { DescriptionListIcon } from 'components/organisms';

const Process = props => {
  const { data, className, ...rest } = props;

  return (
    <div className={className} {...rest}>
      <SectionHeader title="Our process to find you a new job is fast" fadeUp />
      <Grid container spacing={4}>
        {data.map((item, index) => (
          <Grid
            key={index}
            item
            container
            alignItems="center"
            direction="column"
            xs={12}
            sm={12}
            md={4}
            data-aos="fade-up"
          >
            <DescriptionListIcon
              icon={
                <IconAlternate fontIconClass={item.icon} color={colors.blue} />
              }
              title={item.title}
              subtitle={item.subtitle}
              align="left"
            />
          </Grid>
        ))}
        <Grid item container xs={12} justify="center">
          <Button variant="contained" size="large" color="primary">
            get started
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

Process.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
  /**
   * data to be rendered
   */
  data: PropTypes.array.isRequired,
};

export default Process;
