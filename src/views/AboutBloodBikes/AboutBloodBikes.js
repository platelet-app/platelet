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

function AboutBloodBikes() {
  const classes = useStyles();
  return (
    <div id="about-bloodbikes" className={classes.root}>
      <Grid
        container
        direction={"column"}
        spacing={3}
        className={classes.inner}
      >
        <Grid item>
          <Typography variant={"h3"}>About the blood bikes</Typography>
        </Grid>
        <Grid item>
          <Typography>
            The first known blood bikes were established in the 1960s, in
            London, England by Margaret Ryerson and her husband. The concept has
            been developed over the decades since and the blood bikes now
            provide coverage over most of the UK. They provide a courier service
            to the NHS, delivering bloods, platelets, samples, donated breast
            milk, equipment and other items for free. Some groups operate only
            during out of hours, where some are 24/7.
          </Typography>
        </Grid>
        <Grid item>
          <Typography>
            Run 100% by volunteers, the blood bikes receive over 100,000
            requests each year from the NHS. They also deliver to different air
            ambulances around the country, restocking them with new blood and
            returning with unused blood.
          </Typography>
        </Grid>
        <Grid item>
          <Typography>
            There are 36 charities, managed by the Nationwide Association of
            Blood Bikes (NABB) who provide the service. Together they form a
            network of volunteers, working with each other to transport vital
            items across the country.
          </Typography>
        </Grid>
        <Grid item>
          <Typography>
            For more information about NABB and the history of the blood bikes
            visit:
          </Typography>
        </Grid>
        <Grid item>
          <Typography
            component={"a"}
            color="textSecondary"
            href={"https://www.bloodbikes.org.uk/about-nabb/"}
          >
            https://www.bloodbikes.org.uk/about-nabb/
          </Typography>
        </Grid>
      </Grid>
    </div>
  );
}

export default AboutBloodBikes;
