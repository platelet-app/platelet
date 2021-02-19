import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, Divider, Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  divider: {
    margin: theme.spacing(3, 0),
    [theme.breakpoints.up('md')]: {
      margin: theme.spacing(5, 0),
    },
  },
  versionTitle: {
    fontWeight: 700,
  },
  date: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
    fontWeight: 700,
  },
  list: {
    marginLeft: theme.spacing(4),
    marginBottom: theme.spacing(2),
  },
  listItem: {
    margin: theme.spacing(1/2, 0),
  },
}));

const Changelog = ({ className, ...rest }) => {
  const classes = useStyles();

  const BlockItem = ({ versionTitle, date, list }) => (
    <div>
      <Typography variant="h4" component="h4" className={classes.versionTitle}>
        {versionTitle}
      </Typography>
      <Typography variant="body2" component="p" color="textSecondary" className={classes.date}>
        {date}
      </Typography>
      <ul className={classes.list}>
        {list.map((item, i) => (
          <li key={i} className={classes.listItem}>
            <Typography variant="body1" component="p">
              {item}
            </Typography>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className={className} {...rest}>
      <BlockItem
        versionTitle="v3.2.1"
        date="Jan 16, 2021"
        list={[
          "Added new atomic component DarkModeToggler",
          "Replacing the Material-UI form toggler with the custom created DarkModeToggler component",
          "Handling theme mode changes with React state instead of reloading the website",
          `The "./src/utils.js" file is removed`,
          `Added "WithLayout" HOC in "./src" folder to handle the layout changes`,
          `The "RouteWithLayout" component is deleted`,
          `The "ContactForm" component is moved from "common" folder into the "organisms"`,
          `"common" folder is deleted from "./src" folder`,
          `NextJS's "_app.js" file is cleaned-up`,
          `GatsbyJS's "TopLayout.js" file in "./plugins" folder is cleaned-up`,
          "Added a new page in documentation to keep the changelog internally in the website",
        ]}
      />
      <Divider className={classes.divider} />
      <BlockItem
        versionTitle="v3.1.1"
        date="Jan 6, 2021"
        list={[
          "Replace react-styleguidist with custom documentation that can be extended by developers",
          "Improve the selling product pages, redesign the overview page, fix dark mode screenshots, host images in a dedicated server",
          "Code clean-up",
        ]}
      />
      <Divider className={classes.divider} />
      <BlockItem
        versionTitle="v3.0.1"
        date="Dec 16, 2020"
        list={[
          "Layout fixes in mobile and tablet screen sizes",
          "Code cleanup",
          "Removing unnecessary code dependencies",
          "npm scripts naming changes",
          `Initial support for TypeScript under the "Standard Plus" and "Extended" license`,
        ]}
      />
      <Divider className={classes.divider} />
      <BlockItem
        versionTitle="v3.0.0"
        date="Nov 23, 2020"
        list={[
          "Add GatsbyJS support",
        ]}
      />
      <Divider className={classes.divider} />
      <BlockItem
        versionTitle="v2.1.0"
        date="Nov 17, 2020"
        list={[
          "Add dark mode support",
        ]}
      />
      <Divider className={classes.divider} />
      <BlockItem
        versionTitle="v2.0.0"
        date="Nov 8, 2020"
        list={[
          "Consolidate the support of CRA & Next.js under the same version",
          "Upgrade dependencies to the latest version, e.g. Next.js",
          "Bug Fixes",
        ]}
      />
      <Divider className={classes.divider} />
      <BlockItem
        versionTitle="v1.0.3"
        date="July 29, 2020"
        list={[
          "Adapt Accordion component with Material-UI new naming convention changes",
          "Fix img display block issues",
          "Fix npm installed packages vulnerability issues"
        ]}
      />
      <Divider className={classes.divider} />
      <BlockItem
        versionTitle="v1.0.2"
        date="July 24, 2020"
        list={[
          "View components cleanup",
        ]}
      />
      <Divider className={classes.divider} />
      <BlockItem
        versionTitle="v1.0.1"
        date="July 22, 2020"
        list={[
          "Fix cross-platform support for npm scripts and commands",
        ]}
      />
      <Divider className={classes.divider} />
      <BlockItem
        versionTitle="v1.0.0"
        date="July 18, 2020"
        list={[
          "Initial release",
        ]}
      />
    </div>
  );
};

Changelog.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
};

export default Changelog;
