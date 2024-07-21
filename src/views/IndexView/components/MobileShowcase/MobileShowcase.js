import React from "react";
import { Grid, Typography, useMediaQuery, Link } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import showCaseStyles from "../../styles";
import clsx from "clsx";
import mobile_light from "../../../../assets/images/mobile-light.png";
import mobile_dark from "../../../../assets/images/mobile-dark.png";

const MobileShowcase = ({ themeMode = "light", ...rest }) => {
  const classes = showCaseStyles();

  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));

  const mobileClass =
    themeMode === "dark" ? classes.mobileBackDark : classes.mobileBack;

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
          href={themeMode === "dark" ? mobile_dark : mobile_light}
        >
          <div className={clsx(classes.background, mobileClass)} />
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
          <Typography variant={"h4"}>Offline first and mobile ready</Typography>
        </Grid>
        <Grid item>
          <Typography variant={"h6"}>
            Available for riders on Android and iOS. With offline capabilities
            so you can continue to deliver in areas with poor network coverage.
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default MobileShowcase;
