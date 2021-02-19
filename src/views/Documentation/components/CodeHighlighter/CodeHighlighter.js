import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { NoSsr } from '@material-ui/core';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { vs2015 } from 'react-syntax-highlighter/dist/cjs/styles/hljs';

const useStyles = makeStyles(theme => ({
  editor: {
    paddingLeft: `${theme.spacing(2)}px !important`,
    paddingRight: `${theme.spacing(2)}px !important`,
    borderRadius: theme.spacing(1/2),
  },
}));

const CodeHighlighter = ({ code, className, ...rest }) => {
  const classes = useStyles();

  return (
    <div className={className} {...rest}>
      <NoSsr>
        <SyntaxHighlighter language="javascript" style={vs2015} className={classes.editor}>
          {code}
        </SyntaxHighlighter>
      </NoSsr>
    </div>
  );
};

CodeHighlighter.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
  /**
   * Code
   */
  code: PropTypes.string.isRequired,
};

export default CodeHighlighter;
