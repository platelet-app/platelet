import React from "react";
import dialog_light from "../../../../assets/images/dialog-light-new.png";
import dialog_dark from "../../../../assets/images/dialog-dark-new.png";
import { Grid, Typography, useMediaQuery, Link } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import showCaseStyles from "../../styles";
import clsx from "clsx";

const DialogShowcase = ({ themeMode = "light", ...rest }) => {
  const classes = showCaseStyles();

  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up("md"), {
    defaultMatches: true,
  });

  const isSm = theme.breakpoints.down("sm");
  const dialogClass =
    themeMode === "dark" ? classes.dialogBackDark : classes.dialogBack;

  return (
    <Grid
      container
      spacing={isSm ? 0 : 3}
      direction={"row-reverse"}
      justify={"space-between"}
      alignItems={"center"}
    >
      <Grid className={classes.item} item>
        <Link
          target="_blank"
          href={themeMode === "dark" ? dialog_dark : dialog_light}
        >
          <div className={clsx(classes.background, dialogClass)} />
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
            Easily view, edit, and share job details
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant={"h6"}>
            Select from a directory of locations and items. Share extra details
            in comments, or make private notes. Add items and edit the
            inventory. Set priority of consignments.
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default DialogShowcase;
