import React from 'react';
import { Section, SectionAlternate } from 'components/organisms';
import { Faq, Main, Plans, Support } from './components';

import { pricings, faq, plans } from './data';

const Pricing = () => (
  <div>
    <Main data={pricings} />
    <SectionAlternate>
      <Support />
    </SectionAlternate>
    <Section>
      <Faq data={faq} />
    </Section>
    <SectionAlternate>
      <Plans data={plans} />
    </SectionAlternate>
  </div>
);

export default Pricing;
