import React from "react";
import { Grid, Typography, Box, Avatar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import steve from "../../assets/images/steve.jpg";
import joepic from "../../assets/images/joe.jpg";

const useStyles = makeStyles((theme) => ({
  root: {
    background: theme.palette.alternate.main,
  },
  textPerson: {
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

function Testimonials() {
  const classes = useStyles();
  const [joe, setJoe] = React.useState(false);
  return (
    <div id="testimonials" className={classes.root}>
      <Grid
        container
        direction={"column"}
        spacing={3}
        className={classes.inner}
      >
        <Grid item>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 10,
              alignItems: "center",
            }}
          >
            <Avatar
              alt="Steve Curtis"
              style={{ width: 200, height: 200 }}
              src={`${steve}`}
            />
            <Box sx={{ display: "flex", gap: 10, flexDirection: "column" }}>
              <Typography align="right">
                “Platelet Dispatch has been a resounding success for our blood
                bike group. We process about 400 jobs per month through the
                platform and it has been easy to use, a great fit for our
                requirements, and cost effective. If you're a branch of blood
                bikes this is a great job management solution with excellent
                management reports."
              </Typography>
              <Typography
                align="right"
                className={classes.textPerson}
                variant="h6"
              >
                Steve Curtis, Merseyside and Cheshire Blood Bikes
              </Typography>
            </Box>
          </Box>
        </Grid>

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 10,
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", gap: 10, flexDirection: "column" }}>
            <Typography>
              {joe && (
                <>
                  "Hi my name is Joe Tooker and I am the current Vice Chair and
                  Trustee of Freewheelers Emergency Voluntary Blood Bike Service
                  based in the South West of England, one of my roles previously
                  was chief coordinator, a committee role dedicated to ensuring
                  the coordinators of our group had a go to person for support
                  as well as delivering training to all future coordinators.
                  <br />
                  <br />
                  Part of that role was looking at how best to utilise our
                  coordinators and riders. This was when Platelet Dispatch came
                  along, with a view of streamlining the coordinators role and
                  having a good audit trail for all our service users and
                  Service Level Agreement audit requirements.
                  <br />
                  <br />
                  We began our journey with the app in February 2023 with just a
                  few users trialing its capabilities, we soon started to see
                  the benefits. Not only did we now have a fool proof set of
                  statistics with no gaps for reliable reporting but we now had
                  live data direct from our riders allowing us to have extra
                  visibility of what had been collected and delivered and most
                  importantly by who, this was available to us in an instant. By
                  July 2023 all riders and coordinators were using it and in May
                  this year we completed our 10,000th job using the app! A huge
                  milestone for us but also for Theo and his team, showing just
                  how robust and reliable this app is!
                  <br />
                  <br />
                  With change comes lots of mixed emotions, from those who saw
                  nothing wrong with our current paper job sheets and didn’t
                  understand why we would consider changing it, to those who
                  breathed a sigh of relief to a new way of doing things. There
                  was lots of apprehension but as I began to role out the
                  training to the rest of the group, other members soon started
                  to see just how easy it made our day to day operation.
                  <br />
                  <br />
                  With an average of 22 jobs per day it is often a huge task for
                  our duty coordinators to stay on top of bike and sample
                  movements but with Platelet Dispatch that was made easy, with
                  simple job filtering to be able to filter by rider, patch or
                  destination the coordinator could see exactly who was on what
                  job to enable them to make quick decisions when it came to
                  dispatching the next one coming in.
                  <br />
                  <br />
                  We are excited to see what the future looks like for Platelet
                  Dispatch and it would be great to see it developed in a way to
                  allow for push notifications, meaning even further streamlined
                  job dispatch for our members.
                  <br />
                  <br />
                </>
              )}
              {joe ? "" : '"'}This app has been fantastic for us and I could
              never begin to imagine what it would be like to go back to paper
              job sheets! Thank you to Theo and his team for the support along
              the way and for the bespoke features we have requested. It has
              allowed us to integrate the app into our operation seamlessly!"
            </Typography>
            <Typography className={classes.textPerson} variant="h6">
              Joe Tooker, Vice Chair - Freewheelers Emergency Voluntary Blood
              Bike Service
            </Typography>
            <Typography
              style={{
                fontWeight: "bold",
                textDecoration: "underline",
                cursor: "pointer",
              }}
              onClick={() => setJoe(!joe)}
            >
              {!joe ? "Read More" : "Read Less"}
            </Typography>
          </Box>
          <Avatar
            alt="Joe Tooker"
            style={{ width: 200, height: 200 }}
            src={joepic}
          />
        </Box>
      </Grid>
    </div>
  );
}

export default Testimonials;
