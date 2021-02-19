import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import {
  Grid,
  ListItem,
  ListItemAvatar,
  Typography,
  TextField,
  Button,
  colors,
} from '@material-ui/core';
import { Image } from 'components/atoms';
import { SectionHeader, IconAlternate, TypedText } from 'components/molecules';
import { CardProduct } from 'components/organisms';

const FKTextField = withStyles({
  root: {
    '& .MuiInput-underline:before': {
      borderBottom: `1px solid ${colors.blueGrey[50]}`,
    },
    '& .MuiInput-underline:after': {
      borderBottom: `1px solid ${colors.indigo[200]}`,
    },
    '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
      borderBottom: `1px solid ${colors.indigo[200]}`,
    },
  },
})(TextField);

const useStyles = makeStyles(theme => ({
  typed: {
    fontWeight: 'bold',
  },
  listItemAvatar: {
    minWidth: 28,
  },
  formCover: {
    objectFit: 'cover',
    borderBottomLeftRadius: '40%',
  },
  cardProduct: {
    [theme.breakpoints.up('md')]: {
      maxWidth: 400,
    },
  },
}));

const Contact = props => {
  const { data, className, ...rest } = props;
  const classes = useStyles();

  return (
    <div className={className} {...rest}>
      <Grid container spacing={4}>
        <Grid
          item
          container
          justify="flex-start"
          alignItems="center"
          xs={12}
          md={6}
          data-aos="fade-up"
        >
          <CardProduct
            className={classes.cardProduct}
            withShadow
            liftUp
            mediaContent={
              <Image
                src="https://assets.maccarianagency.com/the-front/photos/coworking/place3.jpg"
                srcSet="https://assets.maccarianagency.com/the-front/photos/coworking/place3@2x.jpg 2x"
                alt="Contact cover"
                className={classes.formCover}
                lazy={false}
              />
            }
            cardContent={
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <FKTextField
                    placeholder="Full Name"
                    label="Full Name *"
                    size="medium"
                    name="fullname"
                    fullWidth
                    type="text"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FKTextField
                    placeholder="Email"
                    label="Email *"
                    size="medium"
                    name="email"
                    fullWidth
                    type="email"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FKTextField
                    placeholder="Occupation"
                    label="Occupation"
                    size="medium"
                    name="occupation"
                    fullWidth
                    type="text"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                  >
                    Contact us
                  </Button>
                </Grid>
              </Grid>
            }
          />
        </Grid>
        <Grid
          item
          container
          alignItems="center"
          justify="flex-end"
          xs={12}
          md={6}
          data-aos="fade-up"
        >
          <Grid item>
            <SectionHeader
              label="make things done"
              title={
                <>
                  <span>
                    The most useful resource
                    <br />
                    <Typography color="secondary" variant="inherit" component="span">ever created</Typography>
                    <br />
                    <Typography color="secondary" variant="inherit" component="span">for&nbsp;</Typography>
                  </span>
                  <TypedText
                    component="span"
                    variant="h4"
                    color="secondary"
                    className={classes.typed}
                    typedProps={{
                      strings: ['web developers.', 'fouders.', 'designers.'],
                      typeSpeed: 50,
                      loop: true,
                    }}
                  />
                </>
              }
              subtitle="Using TheFront to build your site means never worrying about designing another page or cross browser compatibility. Our ever-growing library of components and pre-designed layouts will make your life easier."
              align="left"
              disableGutter
            />
            <Grid container spacing={0}>
              {data.map((item, index) => (
                <Grid item xs={6} key={index} data-aos="fade-up">
                  <ListItem disableGutters>
                    <ListItemAvatar className={classes.listItemAvatar}>
                      <IconAlternate
                        size="extraSmall"
                        shape="circle"
                        fontIconClass="fas fa-check"
                        color={colors.deepOrange}
                      />
                    </ListItemAvatar>
                    <Typography variant="subtitle1" color="secondary" noWrap>
                      {item}
                    </Typography>
                  </ListItem>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

Contact.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
  /**
   * Data to render
   */
  data: PropTypes.array.isRequired,
};

export default Contact;
