import React from "react";
import { Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    background: theme.palette.alternate.main,
  },
  inner: {
    maxWidth: theme.layout.contentWidth,
    width: "100%",
    margin: "0 auto",
    padding: theme.spacing(6, 2),
    [theme.breakpoints.up("sm")]: {
      padding: theme.spacing(8, 8),
    },
    [theme.breakpoints.up("md")]: {
      padding: theme.spacing(12, 8),
    },
  },
  innerNarrowed: {
    maxWidth: 800,
  },
}));

function AboutPlatelet() {
  const classes = useStyles();
  return (
    <div id="about-platelet" className={classes.root}>
      <Grid
        container
        direction={"column"}
        spacing={3}
        className={classes.inner}
      >
        <Grid item>
          <Typography variant={"h3"}>About platelet.app</Typography>
        </Grid>
        <Grid item>
          <Typography>
            platelet.app was created in response to an increasing demand on the
            blood biker network across the UK. Its primary mission is to unify
            all blood bike charities under one centralised system, helping
            volunteers deliver a vital service with a modern and easy to use
            application that works on any internet capable device.
          </Typography>
        </Grid>
        <Grid item>
          <Typography>Some of the goals of platelet.app are to:</Typography>
        </Grid>
        <Grid item>
          <Typography>
            - Provide a robust service for recording assignment details,
            synchronised across all devices
            <Typography></Typography>- Let volunteers coordinate cross country
            relays over a wide network of charities
            <Typography></Typography>- Focus on ease of use and a smooth user
            experience
            <Typography></Typography>- Provide more detailed tracking
            information
            <Typography></Typography>- Allow direct requests for deliveries by
            hospital staff through a web interface
            <Typography></Typography>- Help with easier reporting and
            statistical analysis
          </Typography>
        </Grid>
      </Grid>
    </div>
  );
}

export default AboutPlatelet;
