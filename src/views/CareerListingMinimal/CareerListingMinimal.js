import React from 'react';
import { Divider } from '@material-ui/core';
import { Section, SectionAlternate } from 'components/organisms';
import { About, Features, Hero, Jobs, Newsletter } from './components';

import { features, jobs } from './data';

const CareerListingMinimal = () => (
  <div>
    <Hero />
    <Section>
      <About />
    </Section>
    <Features data={features} />
    <SectionAlternate>
      <Jobs data={jobs} />
    </SectionAlternate>
    <Section>
      <Newsletter />
    </Section>
    <Divider />
  </div>
);

export default CareerListingMinimal;
