import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

import { CustomizedDialogs } from '../../../../components/CustomizedDialogs'
import { Step1, Step2, Step3, Step4 } from './index'


const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

const a11yProps = (index) => {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const guidedSetupStyles = makeStyles((theme) => ({
  tabContent: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  btnWrapper: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
  }
}));

export const GuidedSetup = ({ show, onClose, showPreview }) => {
  const classes = guidedSetupStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <CustomizedDialogs open={show} onClose={onClose}>
        <div className={classes.tabContent}>
            <AppBar position="static">
                <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
                    <Tab label="Step 1" {...a11yProps(0)} />
                    <Tab label="Step 2" {...a11yProps(1)} />
                    <Tab label="Step 3" {...a11yProps(2)} />
                    <Tab label="Step 4" {...a11yProps(3)} />
                    <Tab label="Step 5" {...a11yProps(4)} />
                </Tabs>
            </AppBar>
            <TabPanel value={value} index={0}>
                <Step1 />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <Step2 />
            </TabPanel>
            <TabPanel value={value} index={2}>
                <Step3 />
            </TabPanel>
            <TabPanel value={value} index={3}>
                <Step4 />
            </TabPanel>
            <TabPanel value={value} index={4}>
                Item Five
            </TabPanel>
        </div>
        <div className={classes.btnWrapper}>
            <Button autoFocus onClick={onClose} color="primary">
                Skip to overview
            </Button>
            <div>
            {value > 0 && (
                <Button autoFocus onClick={() => setValue(value => value -1)} color="primary">
                    Previous
                </Button>)}
            {value < 4 
            ? (<Button autoFocus onClick={() => setValue(value => value +1)} color="primary">
                    Next
                </Button>)
            : (<Button autoFocus onClick={() => {}} color="primary">
                    Finish
                </Button>)}
            </div>
        </div>
    </CustomizedDialogs>
  );
}

GuidedSetup.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    showPreview: PropTypes.bool,
}
