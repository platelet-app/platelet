import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Card, CardContent, List, ListItem, ListItemText, makeStyles } from '@material-ui/core';
import { SectionHeader } from 'components/molecules';

const useStyles = makeStyles((theme) => ({
  card: {
    marginBottom: theme.spacing(2),
  },
  fontWeight900: {
    fontWeight: 900,
  },
  disablePadding: {
    paddingTop: 0,
    paddingBottom: 0,
  },
}));

const reviewGroup1 = [{
  name: 'Deepak Kapiswe',
  date: 'December 11, 2020',
  feedback: `Best Customer Support I have ever got, Just awesome product. I bought template bundle from another agency but only because of their customer support behaviour I returned and turned to this product. It was one of the best decisions I have taken becasue This team supported me a lot and always available for any querries and they provide really helpful answers. Definitely I'll look for more products from this company.`,
}, {
  name: '@mpazaryna',
  date: 'November 11, 2020',
  feedback: `I've been working with the product, building out a new site. I'm so very, very happy with the quality of the code and the use of best practices. I've been able to modify existing components and make updates that are required for my use case with absolute ease. I've only started to explore the Figma components, but having them available is a big deal for us and we will utilize them more in upcoming development efforts. I've personally learned a great deal by studying and exploring this kit. This has been well worth the effort and I'm very satisfied.`,
}, {
  name: '@gkranasinghe',
  date: 'November 9, 2020',
  feedback: `Absolutely loved it . This product truly deserves 10 out of 10 and I'm grateful for the developers who built this for saving me tons of time  Specially grateful for the quality of the code .very well done`,
}, {
  name: 'Daniel Still',
  date: 'November 8, 2020',
  feedback: `The code is structured incredibly well, and the design is clean and easy to work with. Typescript would be the icing on the cake, but otherwise it is perfect!`,
}, {
  name: 'tom avant',
  date: 'November 5, 2020',
  feedback: `This saved my team a ton of time. Well built and organized.`,
}, {
  name: '@danishyasin33',
  date: 'November 5, 2020',
  feedback: `This multipurpose template helped shave out numerous hours from our development process by providing ready made responsive components. I am very satisfied with the quality of the product and will consider using it in the future.`,
}, {
  name: 'Tien Phan',
  date: 'November 3, 2020',
  feedback: `This is one of the best purchases I have EVER made. Beautiful, dynamic code with media considerations and the proper project structure you could envision. The documentation is so clear & helpful and has taught me so much in terms of how to think the 'React way'. Then on top of that, the customer service is fantastic. Detailed responses that also teach me stuff not included in this purchase! Gevorg and his team are top notch, cannot understate my happiness with this purchase.`,
}];

const reviewGroup2 = [{
  name: 'Michael',
  date: 'November 2, 2020',
  feedback: `Fantastic kit, 10/10! As a college student studying computer science, this kit has taught me how to code in React on a professional level.`,
}, {
  name: 'Rachel Christensen',
  date: 'November 2, 2020',
  feedback: `This is a beautifully designed template set. Each page is elegant and simple without being cold and uninviting. They seem to have thought of every page that you might want. Even if they don't have a specific page you need, it's easy to piece one together with bits and pieces of the other ones. This has saved me so much time and elevated my client's website.`,
}, {
  name: 'Rachel Christensen',
  date: 'November 2, 2020',
  feedback: `This template has BEAUTIFUL code. It consistently uses best practices and uses Mateiral UI and other packages the way they should be used. In addition to making my life a lot easier, they've also helped me learn a thing or two about how to code better in React.`,
}, {
  name: 'Rachel Christensen',
  date: 'November 2, 2020',
  feedback: `The Maccarian Agency customer support is the best support I've ever worked with across template creators and other online resources. They're even more reliable than some of my own co-workers! They're very quick to respond and treat every question or problem you have as if it's their own. They're a pleasure to work with and I'll prioritize tempaltes from them next time I'm in the market for one.`,
}, {
  name: 'yaniv nizry',
  date: 'October 23, 2020',
  feedback: `Great job Gevorg, You really did a teriffic job . It's amazing how many accomplishments are in one UI Kit . It has almost everything you need to create any type of site out there. Worth every cent.`,
}, {
  name: 'Chris Reynolds',
  date: 'October 21, 2020',
  feedback: `Exactly what i needed. Clean and organized code base with excellent UI design.`,
}, {
  name: 'Ashfaq Nisar',
  date: 'October 19, 2020',
  feedback: `One of the best themes available online and great support from the team, Kudos to gevorg for helping me out!`,
}];

const reviewGroup3 = [{
  name: '@marampilly.sarath',
  date: 'January 1, 2021',
  feedback: 'Code quality is excellent, and customer support is really helpful. Totally satisfied.',
}, {
  name: 'Gal Lev',
  date: 'October 5, 2020',
  feedback: `Neat & stylish. time & efforts saver.`,
}, {
  name: '@krzysztof.pier27',
  date: 'September 25, 2020',
  feedback: `i like it very much, easy to understand and use!!!`,
}, {
  name: 'Karthik Divi',
  date: 'September 11, 2020',
  feedback: `Loved the theme, have tons of components to build any kind of app. Please consider dark theme in coming versions.`,
}, {
  name: 'Nick Friedman',
  date: 'August 14, 2020',
  feedback: `Fantastic UI kit. Very flexible. Perfect use of Material UI.`,
}, {
  name: 'Peter James',
  date: 'August 9, 2020',
  feedback: `This theme is open, clean, attractive and very flexible. Almost the components you may need are here - and where they are not you have a clear design structure to add more with Material-UI. Without doubt, the best React/Materia-UI theme on the market today. Support is outstanding.`,
}, {
  name: 'Gene Fernando',
  date: 'August 9, 2020',
  feedback: `This a great theme: modern, very intuitive to use and customize, and lots of sample pages and even full websites. I like the minimalist approach to dependencies and requirements. This makes it easy to upload to cloud platforms like Google or AWS. I tried it on AWS Amplify and it built smoothly and without a hitch. Excellent support as well. I had an installation question and they got to me quickly with instructions. As a new React and Material-UI user, this support is worth its weight in gold ! Buy it... You'll love it !!`,
}, {
  name: 'Edward Legaspi',
  date: 'July 30, 2020',
  feedback: `The team has quickly come to my rescue when I was having an issue with dependency updates in less than 12 hours. Their technical support is really good. It comes with a well crafted documentation too. The theme is well structured and is easy to understand definitely worth the buy.`,
}];

const Reviews = props => {
  const { data, className, ...rest } = props;
  const classes = useStyles();
  return (
    <div className={className} {...rest}>
      <SectionHeader
        title={<>People have had fantastic experiences using theFront.<br />Here’s what they have to say.</>}
        titleProps={{
          variant: 'h4',
          className: classes.fontWeight900,
        }}
        align="left"
      />
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          {reviewGroup1.map((review, index) => (
            <Card key={index} className={classes.card}>
              <CardContent>
                <List disablePadding>
                  <ListItem disableGutters className={classes.disablePadding}>
                    <ListItemText primary={review.name} secondary={review.date} />
                  </ListItem>
                  <ListItem disableGutters className={classes.disablePadding}>
                    <ListItemText primary={review.feedback} />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          ))}
        </Grid>
        <Grid item xs={12} md={4}>
          {reviewGroup2.map((review, index) => (
            <Card key={index} className={classes.card}>
              <CardContent>
                <List disablePadding>
                  <ListItem disableGutters className={classes.disablePadding}>
                    <ListItemText primary={review.name} secondary={review.date} />
                  </ListItem>
                  <ListItem disableGutters className={classes.disablePadding}>
                    <ListItemText primary={review.feedback} />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          ))}
        </Grid>
        <Grid item xs={12} md={4}>
          {reviewGroup3.map((review, index) => (
            <Card key={index} className={classes.card}>
              <CardContent>
                <List disablePadding>
                  <ListItem disableGutters className={classes.disablePadding}>
                    <ListItemText primary={review.name} secondary={review.date} />
                  </ListItem>
                  <ListItem disableGutters className={classes.disablePadding}>
                    <ListItemText primary={review.feedback} />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          ))}
        </Grid>
      </Grid>
    </div>
  );
};

Reviews.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
};

export default Reviews;
