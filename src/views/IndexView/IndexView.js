import React from 'react';
import {makeStyles, Divider, Grid} from '@material-ui/core';
import {Section, SectionAlternate} from 'components/organisms';
import {GetStarted, Features, Reviews, QuickStart, Services, Hero, DialogShowcase} from './components';
import DashboardShowcase from "./components/DashboardShowcase";

const useStyles = makeStyles(() => ({
    sectionAlternateNoPaddingTop: {
        '& .section-alternate__content': {
            paddingBottom: 0,
        },
    },
    dividerSection: {
        paddingTop: 0,
        paddingBottom: 0,
    },
}));

const IndexView = ({themeMode}) => {
    const classes = useStyles();

    return (
        <div>
            <Hero themeMode={themeMode}/>
            <SectionAlternate>
                <DashboardShowcase themeMode={themeMode}/>
            </SectionAlternate>
            <Section>
                <DialogShowcase themeMode={themeMode}/>
            </Section>
            <Section className={classes.dividerSection}>
                <Divider/>
            </Section>
            <SectionAlternate>
                <Features/>
            </SectionAlternate>
            <Section narrow>
                <GetStarted/>
            </Section>
        </div>
    );
};

export default IndexView;
