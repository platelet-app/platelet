import React from 'react';
import { Divider } from '@material-ui/core';
import { Section, SectionAlternate } from 'components/organisms';
import { Features, Folio, Gallery, Hero, Services } from './components';

import { folio, services, features, gallery } from './data';

const PortfolioPage = () => (
  <div>
    <Hero />
    <Section>
      <Folio data={folio} />
    </Section>
    <SectionAlternate>
      <Services data={services} />
    </SectionAlternate>
    <Features data={features} />
    <Section>
      <Gallery data={gallery} />
    </Section>
    <Divider />
  </div>
);

export default PortfolioPage;
