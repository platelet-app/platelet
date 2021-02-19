import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@material-ui/core/styles';

import { useMediaQuery, Grid, Button } from '@material-ui/core';
import { IconText } from 'components/atoms';
import { SectionHeader } from 'components/molecules';

const Props = props => {
  const { data, className, ...rest } = props;

  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  return (
    <div className={className} {...rest}>
      <Grid
        container
        spacing={isMd ? 4 : 0}
        alignItems={isMd ? 'center' : 'flex-start'}
      >
        <Grid item xs={12} sm={12} md={3} data-aos="fade-up">
          <SectionHeader
            title="What's included"
            ctaGroup={[
              <Button
                variant="contained"
                size={isMd ? 'large' : 'medium'}
                color="primary"
              >
                Explore our locations
              </Button>,
            ]}
            fadeUp
            align={isMd ? 'left' : 'center'}
            disableGutter={isMd}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={9} data-aos="fade-up">
          <Grid container spacing={4}>
            {data.map((item, index) => (
              <Grid key={index} item xs={6} sm={4} data-aos={'fade-up'}>
                <Grid item container alignItems="center" xs={12} wrap="nowrap">
                  <IconText
                    fontIconClass={item.icon}
                    color={theme.palette.primary.main}
                    title={item.title}
                  />
                </Grid>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

Props.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
  /**
   * data to be rendered
   */
  data: PropTypes.array.isRequired,
};

export default Props;
