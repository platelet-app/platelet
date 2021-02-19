import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, List, Typography } from '@material-ui/core';
import { SectionHeader } from 'components/molecules';

import { CodeHighlighter } from '../../components';

const useStyles = makeStyles(theme => ({
  fontWeightBold: {
    fontWeight: 'bold',
  },
  list: {
    marginBottom: theme.spacing(3),
    [theme.breakpoints.up('md')]: {
      marginBottom: theme.spacing(4),
    },
  },
}));

const QuickStart = ({ className, ...rest }) => {
  const classes = useStyles();

  return (
    <div className={className} {...rest}>
      <SectionHeader
        title="Quick start with React Scripts"
        subtitle={(
          <Typography variant="h6" component="p" color="textPrimary">
            Open <Typography color="primary" component="span" variant="h6">`./react-scripts`</Typography> folder and do the following:
          </Typography>
        )}
        align="left"
        titleProps={{
          className: classes.fontWeightBold,
          color: 'textPrimary',
        }}
        disableGutter
      />
      <List className={classes.list}>
        <CodeHighlighter
          code={`
> $ npm install

// Everything installed!


> $ npm start

// LiveReload started. Opening localhost:3000


> $ npm run build

// Generated the production bundle
          `}
        />
      </List>
      <SectionHeader
        title="Quick start with NextJS"
        subtitle={(
          <Typography variant="h6" component="p" color="textPrimary">
            Open <Typography color="primary" component="span" variant="h6">`./nextjs`</Typography> folder and do the following:
          </Typography>
        )}
        align="left"
        titleProps={{
          className: classes.fontWeightBold,
          color: 'textPrimary',
        }}
        disableGutter
      />
      <List className={classes.list}>
        <CodeHighlighter
          code={`
> $ npm install

// Everything installed!


> $ npm run dev

// LiveReload started. Opening localhost:3000


> $ npm run build

// Generated the production bundle


> $ npm run start

// Production bundle is up & running on localhost:3000
          `}
        />
      </List>
      <SectionHeader
        title="Quick start with GatsbyJS"
        subtitle={(
          <Typography variant="h6" component="p" color="textPrimary">
            Open <Typography color="primary" component="span" variant="h6">`./gatsbyjs`</Typography> folder and do the following:
          </Typography>
        )}
        align="left"
        titleProps={{
          className: classes.fontWeightBold,
          color: 'textPrimary',
        }}
        disableGutter
      />
      <List>
        <CodeHighlighter
          code={`
> $ npm install

// Everything installed!


> $ npm run develop

// LiveReload started. Opening localhost:8080


> $ npm run build

// Generated the production bundle. The sources are in \`public\` folder
          `}
        />
      </List>
    </div>
  );
};

QuickStart.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
};

export default QuickStart;
