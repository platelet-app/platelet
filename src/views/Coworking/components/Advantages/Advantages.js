import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@material-ui/core/styles';

import { Grid, Typography } from '@material-ui/core';
import { Icon } from 'components/atoms';
import { SectionHeader } from 'components/molecules';
import { DescriptionListIcon } from 'components/organisms';

const Advantages = props => {
  const { data, className, ...rest } = props;
  const theme = useTheme();

  return (
    <div className={className} {...rest}>
      <SectionHeader
        title={
          <span>
            We are reimagining renting to help you{' '}
            <Typography component="span" variant="inherit" color="primary">
              achieve your dreams
            </Typography>
          </span>
        }
        subtitle="Our mission is to help you grow your business, meet and connect with people who share your passions. We help you fulfill your best potential through an engaging lifestyle experience."
        fadeUp
      />
      <Grid container spacing={4}>
        {data.map((item, index) => (
          <Grid key={index} item xs={12} sm={6} md={3} data-aos="fade-up">
            <DescriptionListIcon
              title={item.title}
              subtitle={item.subtitle}
              icon={
                <Icon
                  fontIconClass={item.icon}
                  size="medium"
                  fontIconColor={theme.palette.primary.main}
                />
              }
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
