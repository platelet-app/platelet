import React from "react";
import { Grid, Typography, useTheme } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    background: theme.palette.background.paper,
  },
  subText: {
    background: theme.palette.text.orangeGradient,
    backgroundClip: "text",
    textFillColor: "transparent",
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
  const theme = useTheme();
  return (
    <div id="about-platelet" className={classes.root}>
      <Grid
        container
        direction={"column"}
        spacing={3}
        className={classes.inner}
      >
        <Grid item>
          <Typography className={classes.subText} variant={"h3"}>
            The Blood Bikes
          </Typography>
        </Grid>
        <Grid item>
          <Typography>
            Platelet Dispatch transformed operations for blood bikers with an
            application built on modern technology.
            <br />
            <br />
            Serverless architecture, AWS, and GraphQL reduces costs with no
            reduction in reliability, while web technology and offline
            capabilities let it work on any device, anywhere.
            <br />
            <br />
            Replacing outdated, paper-based processes with a streamlined,
            digital platform, data security is improved, and allows charities to
            manage private information safely. Previously time consuming
            reporting and statistics can now be done instantly. Reliability of
            the service is increased.
            <br />
            <br />
            Platelet Dispatch was developed with ease of use as a central
            requirement, making for a reduced learning curve and minimising
            training time. Many users only volunteer a few days a month, and
            Platelet Dispatch gets them up and running with minimal friction.
            <br />
            <br />
            Platelet Dispatch has been used to record over{" "}
            <span className={classes.subText}> 18,000 consignments </span>
            for the blood bikes so far.
          </Typography>
        </Grid>
      </Grid>
    </div>
  );
}

export default AboutPlatelet;
