import React from 'react';
import * as serviceWorker from "./serviceWorker";
import { IconButton } from "@mui/material";
import RefreshIcon from '@mui/icons-material/Refresh'

export default function registerServiceWorker(props) {
  const refreshAction = (key) => (
    <React.Fragment>
      <IconButton 
        onClick={ () => { 
          window.location.reload(); 
        }} 
        aria-label="refresh to update application"> <RefreshIcon /> </IconButton> 
    </React.Fragment>
  );

  serviceWorker.register({
    onUpdate: (registration) => {

      if (registration && registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      }
          
      props.enqueueSnackbar('Updates Available', {
        action: refreshAction,
        persist: true,
        variant: 'info'
      });
    }
  });
}
