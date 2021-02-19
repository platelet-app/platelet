import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@material-ui/core/styles';
import { useMediaQuery } from '@material-ui/core';
import { SectionHeader } from 'components/molecules';

const Story = props => {
  const { className, ...rest } = props;

  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  return (
    <div className={className} {...rest}>
      <SectionHeader
        title="Our story"
        subtitle="If we're no longer the right solution for you, we'll allow you to export and take your data at anytime for any reason. If we're no longer the right solution for you, we'll allow you to export and take your data at anytime for any reason.If we're no longer the right solution for you, we'll allow you to export and take your data at anytime for any reason.If we're no longer the right solution for you, we'll allow you to export and take your data at anytime for any reason.If we're no longer the right solution for you, we'll allow you to export and take your data at anytime for any reason."
        align={isMd ? 'center' : 'left'}
        disableGutter
        subtitleProps={{
          color: 'textPrimary',
          variant: 'body1',
        }}
      />
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
