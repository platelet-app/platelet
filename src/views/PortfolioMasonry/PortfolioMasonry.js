import React from 'react';
import { Section, SectionAlternate } from 'components/organisms';
import { Hero, Main, Partners, Contact } from './components';

import { folio, partners } from './data';

const PortfolioMasonry = () => (
  <div>
    <Hero />
    <Partners data={partners} />
    <Section>
      <Main data={folio} />
    </Section>
    <SectionAlternate>
      <Contact />
    </SectionAlternate>
  </div>
);

export default PortfolioMasonry;
