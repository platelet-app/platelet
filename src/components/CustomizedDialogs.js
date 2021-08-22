import React from 'react';
import PropTypes from 'prop-types'

import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';

const styles = (theme) => ({
  root: {
    margin: "14px",
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    display: "inline-block",
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

export const CustomizedDialogs = ({ open, onClose, children: [content, cta] })  => {
  return (
    <Dialog 
      onClose={onClose} 
      aria-labelledby="customized-dialog-title" 
      open={open}
      maxWidth={'lg'}>
      <DialogTitle id="customized-dialog-title" onClose={onClose} />
      <DialogContent dividers>
        {content}
      </DialogContent>
      <DialogActions>
        {cta}
      </DialogActions>
    </Dialog>
  );
}

CustomizedDialogs.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  children: PropTypes.node,
}
