import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';
import { IconAlternate, SectionHeader } from 'components/molecules';
import { DescriptionListIcon, CardBase } from 'components/organisms';

const useStyles = makeStyles(theme => ({
  answerCount: {
    padding: theme.spacing(1 / 2, 1),
    borderRadius: theme.spacing(1),
    background: theme.palette.secondary.light,
    color: 'white',
    fontWeight: 700,
    marginTop: theme.spacing(2),
  },
}));

const Categories = props => {
  const { data, className, ...rest } = props;
  const classes = useStyles();
  return (
    <div className={className} {...rest}>
      <SectionHeader
        title="Related Help Center Categories"
        subtitle="If you didn’t find what you needed, these could help!"
        align="left"
      />
      <Grid container spacing={2}>
        {data.map((item, index) => (
          <Grid item xs={12} sm={12} md={4} key={index}>
            <CardBase
              liftUp
              variant="outlined"
              style={{ borderTop: `5px solid ${item.color[500]}` }}
            >
              <DescriptionListIcon
                icon={
                  <IconAlternate
                    fontIconClass={item.icon}
                    color={item.color}
                    shape="circle"
                    size="medium"
                  />
                }
                title={item.title}
                subtitle={item.subtitle}
              />
              <Typography variant="body1" className={classes.answerCount}>
                8 answers
              </Typography>
            </CardBase>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

Categories.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
  /**
   * data to be rendered
   */
  data: PropTypes.array.isRequired,
};

export default Categories;
