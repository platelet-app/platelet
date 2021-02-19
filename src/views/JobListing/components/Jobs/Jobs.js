import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@material-ui/core/styles';
import { Grid, Button, useMediaQuery } from '@material-ui/core';

import { LearnMoreLink } from 'components/atoms';
import { SectionHeader } from 'components/molecules';
import { CardJobTag } from 'components/organisms';

const Jobs = props => {
  const { data, className, ...rest } = props;

  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  return (
    <div className={className} {...rest}>
      <SectionHeader
        title="Jobs that we provide you"
        subtitle={
          <>
            We get thousands of job postings weekly, but only accept the
            openings at the top companies.
            <LearnMoreLink title="&nbsp;Set career interests" variant="h6" />
          </>
        }
        align="left"
      />
      <Grid container spacing={isMd ? 4 : 2}>
        {data.map((item, index) => (
          <Grid
            key={index}
            item
            container
            alignItems="center"
            direction="column"
            xs={12}
            sm={6}
            md={4}
            data-aos="fade-up"
          >
            <CardJobTag
              variant="outlined"
              liftUp
              jobTitle={item.jobTitle}
              badgeColor={item.color}
              badgeTitle={item.title}
              jobLocation={item.location}
              jobType={item.type}
            />
          </Grid>
        ))}
        <Grid item container justify="center" xs={12} data-aos="fade-up">
          <Button variant="outlined" color="primary" size="large">
            See all list
          </Button>
        </Grid>
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
   * Data to be rendered
   */
  data: PropTypes.array.isRequired,
};

export default Jobs;
