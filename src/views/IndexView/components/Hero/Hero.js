import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Typography } from "@material-ui/core";
import { SectionHeader, TypedText } from "components/molecules";
import { HeroShaped } from "components/organisms";
import bike1 from "../../../../assets/images/bike1.jpg";

const useStyles = makeStyles((theme) => ({
  fontWeight900: {
    fontWeight: 900,
  },
  leftSideContent: {
    "& .section-header__cta-container": {
      [theme.breakpoints.down("xs")]: {
        flexDirection: "column",
        "& .section-header__cta-item-wrapper": {
          width: "100%",
          "&:last-child": {
            marginLeft: 0,
            marginTop: theme.spacing(1),
          },
          "& .MuiButtonBase-root": {
            width: "100%",
          },
        },
      },
    },
  },
  heroShaped: {
    "& .hero-shaped__image": {
      backgroundColor: theme.palette.alternate.main,
    },
    [theme.breakpoints.down("sm")]: {
      "& .hero-shaped__image": {
        position: "relative",
        left: -150,
      },
      "& .hero-shaped__wrapper": {
        flexDirection: "column",
      },
    },
  },
  imageAnimation: {
    background: `url(${bike1})`,
    backgroundRepeat: "no-repeat",
    backgroundAttachment: "scroll",
    backgroundSize: "cover",
    width: "900px",
    height: "900px",
    backgroundColor: theme.palette.alternate.dark,
  },
}));

const Hero = ({ themeMode = "light", className, ...rest }) => {
  const classes = useStyles();

  const title = (
    <Typography variant="h2" component="span" className={classes.fontWeight900}>
      A dispatch system designed for emergency volunteer couriers
      <br />
    </Typography>
  );

  const subtitle =
    "Connect from anywhere to coordinate fleets and record deliveries.";

  const viewDemo = (
    <Button
      variant="contained"
      color="primary"
      component="a"
      target="_blank"
      href="https://demo.platelet.app"
    >
      View a demo
    </Button>
  );

  const viewCode = (
    <Button
      variant="contained"
      color="primary"
      component="a"
      target="_blank"
      href="https://github.com/platelet-app/platelet"
    >
      View the code
    </Button>
  );

  const loginButton = (
    <Button
      style={{ display: "none" }}
      size="large"
      variant="contained"
      color="primary"
      component="a"
      href="/dashboard"
    >
      Open platelet
    </Button>
  );

  const leftSideContent = (
    <SectionHeader
      title={title}
      subtitle={subtitle}
      align="left"
      titleProps={{
        variant: "h2",
        color: "textPrimary",
      }}
      ctaGroup={[viewDemo]}
      data-aos="fade-right"
      disableGutter
      className={classes.leftSideContent}
    />
  );
  return (
    <div className={className} {...rest}>
      <HeroShaped
        className={classes.heroShaped}
        leftSide={leftSideContent}
        rightSide={<div className={classes.imageAnimation} />}
      />
    </div>
  );
};

Hero.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
  /**
   * Theme mode
   */
  themeMode: PropTypes.string,
};

export default Hero;
