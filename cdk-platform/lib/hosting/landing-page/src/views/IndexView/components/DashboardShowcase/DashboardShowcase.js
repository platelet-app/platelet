import React from "react";
import { Grid, Typography, Link } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import showCaseStyles from "../../styles";
import clsx from "clsx";
import dashboard_light from "../../../../assets/images/dashboard-light.png";
import dashboard_dark from "../../../../assets/images/dashboard-dark.png";

const DashboardShowcase = ({ themeMode = "light", ...rest }) => {
  const classes = showCaseStyles();
  const theme = useTheme();
  const dashboardClass =
    themeMode === "dark" ? classes.dashboardBackDark : classes.dashboardBack;
  const isSm = theme.breakpoints.down("sm");
  return (
    <Grid
      container
      spacing={isSm ? 0 : 3}
      direction={"row"}
      justify={"space-between"}
      alignItems={"center"}
    >
      <Grid className={classes.item} item>
        <Link
          target="_blank"
          href={themeMode === "dark" ? dashboard_dark : dashboard_light}
        >
          <div className={clsx(classes.background, dashboardClass)} />
        </Link>
      </Grid>
      <Grid
        container
        data-aos={"fade-right"}
        item
        alignItems={"center"}
        justify={"center"}
        spacing={isSm ? 0 : 2}
        direction={"column"}
        className={classes.text}
      >
        <Grid item>
          <Typography className={classes.subText} variant={"h4"}>
            Tailored dashboards for coordinators and riders
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant={"h6"}>
            Assign jobs to riders and see all of their assigned jobs at a
            glance.
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default DashboardShowcase;
