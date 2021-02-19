import React from 'react';
import PropTypes from 'prop-types';
import { Grid, colors } from '@material-ui/core';
import { IconAlternate } from 'components/molecules';
import { DescriptionListIcon } from 'components/organisms';

const Advantages = props => {
  const { data, className, ...rest } = props;

  return (
    <div className={className} {...rest}>
      <Grid container spacing={4}>
        {data.map((item, index) => (
          <Grid key={index} item xs={12} md={3} data-aos={'fade-up'}>
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
    </div>
  );
};

Advantages.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
  /**
   * data to be rendered
   */
  data: PropTypes.array.isRequired,
};

export default Advantages;
