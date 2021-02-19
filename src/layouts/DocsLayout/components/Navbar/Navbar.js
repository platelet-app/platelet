import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Drawer,
  Hidden,
  List,
  Typography,
  ListItem,
  makeStyles
} from '@material-ui/core';
import NavItem from './components/NavItem';
import { components } from './data';

const useStyles = makeStyles(theme => ({
  mobileDrawer: {
    width: 256
  },
  desktopDrawer: {
    width: 256,
    top: 64,
    height: 'calc(100% - 64px)'
  },
  title: {
    fontWeight: 700,
  },
  navGroup: {
    marginBottom: theme.spacing(2),
    '&:last-child': {
      marginBottom: 0,
    },
  },
  navGroupTitle: {
    paddingBottom: 0,
  },
}));

const Navbar = ({ onMobileClose, openMobile }) => {
  const classes = useStyles();

  const content = (
    <Box
      height="100%"
      display="flex"
      flexDirection="column"
    >
      <Box p={2} paddingBottom={0}>
        <List>
          {components.map((item) => (
            <div key={item.id}>
              <ListItem className={classes.navGroupTitle}>
                <Typography variant="button" color="textSecondary" className={classes.title}>{item.title}</Typography>
              </ListItem>
              <List disablePadding className={classes.navGroup}>
                {item.pages.map((page) => (
                  <NavItem
                    href={page.href}
                    key={page.id}
                    title={page.title}
                    id={page.id}
                  />
                ))}
              </List>
            </div>
          ))}
        </List>
      </Box>
      <Box flexGrow={1} />
      <Box p={2} paddingTop={0}>
        <Box
          display="flex"
          justifyContent="center"
          mt={2}
        >
          <Button
            color="primary"
            component="a"
            href="/"
            variant="outlined"
            fullWidth
          >
            SEE ALL PAGES
          </Button>
        </Box>
        <Box
          display="flex"
          justifyContent="center"
          mt={2}
        >
          <Button
            color="primary"
            component="a"
            href="https://material-ui.com/store/items/the-front-landing-page/"
            variant="contained"
            target="blank"
            fullWidth
          >
            BUY NOW
          </Button>
        </Box>
      </Box>
    </Box>
  );

  return (
    <>
      <Hidden mdUp>
        <Drawer
          anchor="left"
          classes={{ paper: classes.mobileDrawer }}
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary"
        >
          {content}
        </Drawer>
      </Hidden>
      <Hidden smDown>
        <Drawer
          anchor="left"
          classes={{ paper: classes.desktopDrawer }}
          open
          variant="persistent"
        >
          {content}
        </Drawer>
      </Hidden>
    </>
  );
};

Navbar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool
};

Navbar.defaultProps = {
  onMobileClose: () => {},
  openMobile: false
};

export default Navbar;