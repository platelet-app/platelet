import React from 'react';
import { Box, Button } from '@material-ui/core';
import { Headline, CodeHighlighter, PropsHighlighter, SectionBox } from '../../components';
import { HeroSimpleBackground } from 'components/organisms';
import { SectionHeader } from 'components/molecules';
import { Section } from 'components/organisms';

const importCodeString = `
import { HeroSimpleBackground } from 'components/organisms';
// or
import HeroSimpleBackground from 'components/organisms/HeroSimpleBackground';
`;

const dataProperties = [{
  name: 'backgroundImage',
  type: 'string',
  default: '',
  description: 'The background image of the hero',
}, {
  name: 'children',
  type: 'node',
  default: '',
  description: 'The main content',
}, {
  name: 'backgroundPosition',
  type: 'string',
  default: 'center',
  description: 'The background position of the hero',
}, {
  name: 'backgroundSize',
  type: 'string',
  default: 'cover',
  description: 'The background size of the hero',
}, {
  name: 'className',
  type: 'string',
  default: '',
  description: 'External classes',
}];

const exampleCode1 = `
import React from 'react';
import { Box, Button } from '@material-ui/core';
import { HeroSimpleBackground } from 'components/organisms';
import { SectionHeader } from 'components/molecules';
import { Section } from 'components/organisms';

export default function Example() {
  return (
    <Box marginBottom={2} padding={2} border="1px solid #ccc" borderRadius="4px">
      <HeroSimpleBackground backgroundImage="https://assets.maccarianagency.com/the-front/shapes/banner-bg.svg">
        <Section narrow>
          <SectionHeader
            title="Supercharge Your Web Product's UI/UX Design"
            titleVariant="h2"
            subtitle="Our mission is to help you to grow your design skills, meet and connect with professional dsigners who share your passions. We help you fulfill your best potential through an engaging lifestyle experience."
            ctaGroup={[(
              <Button color="primary" variant="contained" size="large">Try for free</Button>
            ), (
              <Button color="primary" variant="outlined" size="large">See pricings</Button>
            )]}
          />
        </Section>
      </HeroSimpleBackground>
    </Box>
  );
}
`;

const HeroSimpleBackgroundExample = ({ ...rest }) => (
  <div {...rest}>
    <SectionBox title="Description" gutterBottom>
      <Headline
        title="HeroSimpleBackground"
        path="src/components/organisms/HeroSimpleBackground/HeroSimpleBackground.js"
        description="Component to display the background heros"
      />
    </SectionBox>
    <SectionBox title="Import" gutterBottom>
      <CodeHighlighter code={importCodeString} />
    </SectionBox>
    <SectionBox title="Props & Methods" gutterBottom>
      <PropsHighlighter dataProperties={dataProperties} />
    </SectionBox>
    <SectionBox title="Basic Example" gutterBottom>
      <>
        <Box marginBottom={2} padding={2} border="1px solid #ccc" borderRadius="4px">
          <HeroSimpleBackground backgroundImage="https://assets.maccarianagency.com/the-front/shapes/banner-bg.svg">
            <Section narrow>
              <SectionHeader
                title="Supercharge Your Web Product's UI/UX Design"
                titleVariant="h2"
                subtitle="Our mission is to help you to grow your design skills, meet and connect with professional dsigners who share your passions. We help you fulfill your best potential through an engaging lifestyle experience."
                ctaGroup={[(
                  <Button color="primary" variant="contained" size="large">Try for free</Button>
                ), (
                  <Button color="primary" variant="outlined" size="large">See pricings</Button>
                )]}
              />
            </Section>
          </HeroSimpleBackground>
        </Box>
        <CodeHighlighter code={exampleCode1} />
      </>
    </SectionBox>
  </div>
);

export default HeroSimpleBackgroundExample;
