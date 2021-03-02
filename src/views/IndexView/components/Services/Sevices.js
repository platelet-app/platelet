import React from 'react';
import PropTypes from 'prop-types';
import {useTheme, makeStyles} from '@material-ui/core/styles';
import {useMediaQuery, Grid, Typography, colors} from '@material-ui/core';
import {IconAlternate, SectionHeader} from 'components/molecules';
import {DescriptionListIcon, Section} from 'components/organisms';

const useStyles = makeStyles(() => ({
    fontWeight900: {
        fontWeight: 900,
    },
    noPaddingBottom: {
        paddingBottom: 0,
    },
    noPaddingTop: {
        paddingTop: 0,
    },
    paddingLeft: {
        paddingTop: 0,
        paddingLeft: "100px"
    },
}));

const dataRow1 = [
    {
        icon: 'fab fa-sketch',
        title: 'Real time updates',
        subtitle:
            'Assign jobs in real time and be notified on pick ups and deliveries.',
    },
    {
        icon: 'fas fa-code',
        title: 'Directory of locations',
        subtitle:
            "Quickly select locations from a searchable directory.",
    },
];
const dataRow2 = [
    {
        icon: 'fab fa-sketch',
        title: 'Record details',
        subtitle:
            'Couriers can use a mobile device to record names on pick up and delivery.',
    },
    {
        icon: 'fas fa-code',
        title: 'Assign vehicles',
        subtitle:
            "Assign users to vehicles that are a part of your fleet.",
    },
];
const Services = ({className, ...rest}) => {
    const classes = useStyles();
    const theme = useTheme();
    const isMd = useMediaQuery(theme.breakpoints.up('md'), {
        defaultMatches: true,
    });

    return (
        <Grid className={className} direction={"column"} container spacing={2}>
            <Grid container direction={"row"} item spacing={2}>
                {dataRow1.map((item, index) => (
                    <Grid key={index} item style={{width: 300}} data-aos={'fade-up'}>
                        <DescriptionListIcon
                            title={item.title}
                            subtitle={item.subtitle}
                            icon={
                                <IconAlternate
                                    fontIconClass={item.icon}
                                    size="medium"
                                    color={colors.lightBlue}
                                />
                            }
                            align="left"
                        />
                    </Grid>
                ))}
            </Grid>
            <Grid container direction={"row"} item spacing={2}>
                {dataRow2.map((item, index) => (
                    <Grid key={index} item style={{width: 300}} data-aos={'fade-up'}>
                        <DescriptionListIcon
                            title={item.title}
                            subtitle={item.subtitle}
                            icon={
                                <IconAlternate
                                    fontIconClass={item.icon}
                                    size="medium"
                                    color={colors.lightBlue}
                                />
                            }
                            align="left"
                        />
                    </Grid>
                ))}
            </Grid>
        </Grid>
    );
};

Services.propTypes = {
    /**
     * External classes
     */
    className: PropTypes.string,
};

export default Services;
