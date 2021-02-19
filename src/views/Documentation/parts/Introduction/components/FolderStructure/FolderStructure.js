import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, colors, List, Typography, Box } from '@material-ui/core';
import { SectionHeader } from 'components/molecules';
import { IconText } from 'components/atoms';

const useStyles = makeStyles(theme => ({
  fontWeightBold: {
    fontWeight: 'bold',
  },
  notification: {
    borderRadius: theme.spacing(1/2),
    border: '2px solid',
    marginBottom: theme.spacing(2),
    backgroundColor: colors.green[50],
    borderColor: colors.green[500],
    '& .MuiTypography-root': {
      color: colors.green[900],
    },
  },
}));

const FolderStructure = ({ className, ...rest }) => {
  const classes = useStyles();

  const Folder = ({ title, subtitle, depth }) => (
    <Box display="flex" flexDirection="column" marginLeft={depth || 0}>
      <IconText
        fontIconClass="fas fa-folder"
        color={colors.blueGrey[900]}
        title={title}
      />
      {subtitle && (
        <Typography variant="caption" color="textSecondary">
          {subtitle}
        </Typography>
      )}
    </Box>
  );

  return (
    <div className={className} {...rest}>
      <SectionHeader
        title="Folder structure"
        subtitle="In your copy of the kit you will find 3 main repos corresponding to the React-Scripts, NextJS and GatsbyJS frameworks"
        align="left"
        titleProps={{
          className: classes.fontWeightBold,
          color: 'textPrimary',
        }}
        disableGutter
      />
      <List>
        <Box display="flex" flexDirection="column">
          <IconText
            fontIconClass="fas fa-folder"
            color={colors.blueGrey[900]}
            title="gatsbyjs"
          />
          <Typography variant="caption" color="textSecondary">
          The GatsbyJS version of the kit is located in this folder. 
          </Typography>
        </Box>
        <Box display="flex" flexDirection="column">
          <IconText
            fontIconClass="fas fa-folder"
            color={colors.blueGrey[900]}
            title="nextjs"
          />
          <Typography variant="caption" color="textSecondary">
          The NextJS version of the kit is located in this folder. 
          </Typography>
        </Box>
        <Box display="flex" flexDirection="column">
          <IconText
            fontIconClass="fas fa-folder"
            color={colors.blueGrey[900]}
            title="react-scripts"
          />
          <Typography variant="caption" color="textSecondary">
          The React-Scripts version of the kit is located in this folder. 
          </Typography>
        </Box>
      </List>
      <Box marginTop={2}>
        <Typography variant="h6" color="textPrimary">
          gatsbyjs folder
        </Typography>
      </Box>
      <List>
        <Folder title="pages" subtitle="GatsbyJS pages are located under this folder" />
        <Folder title="plugins" subtitle="GatsbyJS custom plugins are located under this folder" />
        <Folder title="src" />
        <Folder title="assets" depth={3} />
        <Folder title="components" depth={3} subtitle="The reusable and stand-alone components are stored here, by following Atomic Design Methodology" />
        <Folder title="atoms" depth={7} subtitle="These are small functional components that are not using any other atomic components" />
        <Folder title="molecules" depth={7} subtitle="These are those functional components which have dependencies from other atoms" />
        <Folder title="organisms" depth={7} subtitle="These are the functional components that are using other molecules and atoms" />
        <Folder title="layouts" depth={3} />
        <Folder title="Main" depth={7} subtitle="The main layout: header navigation, the main container and footer part" />
        <Folder title="Minimal" depth={7} subtitle="The minimal layout" />
        <Folder title="DocsLayout" depth={7} subtitle=" Documentation layout" />
        <Folder title="theme" depth={3} subtitle="In this folder there are overrides of the default color palette coming from MUI" />
        <Folder title="views" depth={3} subtitle="All the views/pages that are available. Here are the combination and composition of re-usable components and pages representations." />
      </List>
      <Box marginTop={2}>
        <Typography variant="h6" color="textPrimary">
          nextjs folder
        </Typography>
      </Box>
      <List>
        <Folder title="pages" subtitle="NextJS pages are located under this folder" />
        <Folder title="public" />
        <Folder title="src" />
        <Folder title="assets" depth={3} />
        <Folder title="components" depth={3} subtitle="The reusable and stand-alone components are stored here, by following Atomic Design Methodology" />
        <Folder title="atoms" depth={7} subtitle="These are small functional components that are not using any other atomic components" />
        <Folder title="molecules" depth={7} subtitle="These are those functional components which have dependencies from other atoms" />
        <Folder title="organisms" depth={7} subtitle="These are the functional components that are using other molecules and atoms" />
        <Folder title="layouts" depth={3} />
        <Folder title="Main" depth={7} subtitle="The main layout: header navigation, the main container and footer part" />
        <Folder title="Minimal" depth={7} subtitle="The minimal layout" />
        <Folder title="DocsLayout" depth={7} subtitle=" Documentation layout" />
        <Folder title="theme" depth={3} subtitle="In this folder there are overrides of the default color palette coming from MUI" />
        <Folder title="views" depth={3} subtitle="All the views/pages that are available. Here are the combination and composition of re-usable components and pages representations." />
      </List>
      <Box marginTop={2}>
        <Typography variant="h6" color="textPrimary">
          react-scripts folder
        </Typography>
      </Box>
      <List>
        <Folder title="public" />
        <Folder title="src" />
        <Folder title="assets" depth={3} />
        <Folder title="components" depth={3} subtitle="The reusable and stand-alone components are stored here, by following Atomic Design Methodology" />
        <Folder title="atoms" depth={7} subtitle="These are small functional components that are not using any other atomic components" />
        <Folder title="molecules" depth={7} subtitle="These are those functional components which have dependencies from other atoms" />
        <Folder title="organisms" depth={7} subtitle="These are the functional components that are using other molecules and atoms" />
        <Folder title="layouts" depth={3} />
        <Folder title="Main" depth={7} subtitle="The main layout: header navigation, the main container and footer part" />
        <Folder title="Minimal" depth={7} subtitle="The minimal layout" />
        <Folder title="DocsLayout" depth={7} subtitle=" Documentation layout" />
        <Folder title="theme" depth={3} subtitle="In this folder there are overrides of the default color palette coming from MUI" />
        <Folder title="views" depth={3} subtitle="All the views/pages that are available. Here are the combination and composition of re-usable components and pages representations." />
      </List>
    </div>
  );
};

FolderStructure.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
};

export default FolderStructure;
