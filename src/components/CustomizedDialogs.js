import React from 'react';
import PropTypes from 'prop-types'

import withStyles from '@mui/styles/withStyles';
import makeStyles from '@mui/styles/makeStyles';
import Dialog from '@mui/material/Dialog';
import MuiDialogTitle from '@mui/material/DialogTitle';
import MuiDialogContent from '@mui/material/DialogContent';
import MuiDialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';

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
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
          size="large">
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

const CustomizedDialogsStyles = makeStyles((theme) => ({
  dialogPaper: {
    minHeight: '60vh',
    maxHeight: '60vh',
  },
}));

export const CustomizedDialogs = ({ open, onClose, children: [content, cta] })  => {
  const classes = CustomizedDialogsStyles()
  return (
    <Dialog 
      classes={{ paper: classes.dialogPaper }}
      onClose={onClose} 
      aria-labelledby="customized-dialog-title" 
      open={open}
      maxWidth={'xl'}>
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
