import React from "react";
import PropTypes from "prop-types";
import { Grid, colors, makeStyles, useTheme } from "@material-ui/core";
import { SectionHeader, IconAlternate } from "components/molecules";
import { CardBase, DescriptionListIcon } from "components/organisms";

const useStyles = makeStyles(() => ({
  fontWeight900: {
    fontWeight: 900,
  },
}));

const data = [
  {
    icon: "fas fa-file-invoice",
    color: colors.common.white,
    title: "Reporting",
    subtitle:
      "Statistics and reporting features, with the ability to export your data.",
  },
  {
    icon: "fas fa-motorcycle",
    color: colors.common.white,
    title: "Fleet management",
    subtitle: "Add your vehicles and assign riders to them.",
  },
  {
    icon: "fas fa-mobile-alt",
    color: colors.common.white,
    title: "Use anywhere",
    subtitle:
      "Developed with standard web technology for compatibility across a broad range of devices.",
  },
  {
    icon: "fa-solid fa-hand-pointer",
    color: colors.common.white,
    title: "Easy to use",
    subtitle:
      "Used by volunteers across the country, Platelet Dispatch lets them save lives without slowing them down.",
  },
  {
    icon: "fas fa-rocket",
    color: colors.common.white,
    title: "Update and track consignment status",
    subtitle:
      "Mark consignments as Active, Picked Up, Delivered, Rider Home, or Cancelled, Rejected and Abandoned.",
  },
  {
    icon: "fa-solid fa-clock-rotate-left",
    color: colors.common.white,
    title: "History",
    subtitle:
      "Look through consignment history and view a timeline of events, filtering by date to find what you need.",
  },
];

const Features = ({ className, ...rest }) => {
  const classes = useStyles();
  const theme = useTheme();

  return (
    <div className={className} {...rest}>
      <SectionHeader
        title={""}
        fadeUp
        titleProps={{
          variant: "h3",
          color: "textPrimary",
          className: classes.fontWeight900,
        }}
      />
      <Grid container spacing={2}>
        {data.map((adv, index) => (
          <Grid
            key={index}
            item
            container
            alignItems="center"
            direction="column"
            xs={6}
            md={4}
            data-aos="fade-up"
          >
            <CardBase
              liftUp
              variant="outlined"
              style={{
                borderRadius: "1em",
              }}
            >
              <DescriptionListIcon
                icon={
                  <IconAlternate
                    fontIconClass={adv.icon}
                    color={adv.color}
                    shape="circle"
                    size="small"
                  />
                }
                title={adv.title}
                subtitle={adv.subtitle}
                align="left"
              />
            </CardBase>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

Features.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
};

export default Features;
