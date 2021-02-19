import React from 'react';
import { Box, Grid, Typography, Button, colors } from '@material-ui/core';
import { Headline, CodeHighlighter, PropsHighlighter, SectionBox } from '../../components';
import { HeroBackground } from 'components/organisms';

const importCodeString = `
import { HeroBackground } from 'components/organisms';
// or
import HeroBackground from 'components/organisms/HeroBackground';
`;

const dataProperties = [{
  name: 'backgroundColor',
  type: 'string',
  default: '',
  description: 'Background color of the hero',
}, {
  name: 'backgroundImg',
  type: 'string',
  default: '',
  description: 'Background image of the hero',
}, {
  name: 'backgroundPosition',
  type: 'string',
  default: '',
  description: 'Background position of the hero',
}, {
  name: 'children',
  type: 'node',
  default: '',
  description: 'Children to placed inside the hero',
}, {
  name: 'contentSectionClassName',
  type: 'string',
  default: '',
  description: 'Custom classes for the content section',
}, {
  name: 'disbaleCoverOpacity',
  type: 'bool',
  default: '',
  description: 'Should disable here cover opacity',
}, {
  name: 'className',
  type: 'string',
  default: '',
  description: 'External classes',
}];

const exampleCode1 = `
import React from 'react';
import { Box, Grid, Typography, Button } from '@material-ui/core';
import { HeroBackground } from 'components/organisms';

export default function Example() {
  return (
    <Box marginBottom={2} padding={2} border="1px solid #ccc" borderRadius="4px">
      <HeroBackground>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Typography variant="h3" style={{ color: 'white', fontWeight: 900, }}>
                Join the world's leading companies at TheFront 2020
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" style={{ color: 'white' }} gutterBottom>
                Whether it’s Porsche, Stripe, Intercom, Amazon, or Google, something about TheFront works for our global partners.
            </Typography>
            <Typography variant="h5" style={{ color: 'white' }}>
                Want more information? Download our overview and a member of our specialist team will be in touch to talk about your goals for TheFront 2020.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Button variant="contained">Download exhibitor overview</Button>
          </Grid>
        </Grid>
      </HeroBackground>
    </Box>
  );
}
`;

const exampleCode2 = `
import React from 'react';
import { Box, Grid, Typography, Button, colors } from '@material-ui/core';
import { HeroBackground } from 'components/organisms';

export default function Example() {
  return (
    <Box marginBottom={2} padding={2} border="1px solid #ccc" borderRadius="4px">
      <HeroBackground backgroundColor={colors.blue[500]}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Typography variant="h3" style={{ color: 'white', fontWeight: 900, }}>
                Join the world's leading companies at TheFront 2020
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" style={{ color: 'white' }} gutterBottom>
                Whether it’s Porsche, Stripe, Intercom, Amazon, or Google, something about TheFront works for our global partners.
            </Typography>
            <Typography variant="h5" style={{ color: 'white' }}>
                Want more information? Download our overview and a member of our specialist team will be in touch to talk about your goals for TheFront 2020.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Button variant="contained">Download exhibitor overview</Button>
          </Grid>
        </Grid>
      </HeroBackground>
    </Box>
  );
}
`;

const exampleCode3 = `
import React from 'react';
import { Box, Grid, Typography, Button, colors } from '@material-ui/core';
import { HeroBackground } from 'components/organisms';

export default function Example() {
  return (
    <Box marginBottom={2} padding={2} border="1px solid #ccc" borderRadius="4px">
      <HeroBackground backgroundImg="https://assets.maccarianagency.com/the-front/photos/expo-gallery/gallery3.jpg">
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Typography variant="h3" style={{ color: 'white', fontWeight: 900, }}>
              Join the world's leading companies at TheFront 2020
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" style={{ color: 'white' }} gutterBottom>
              Whether it’s Porsche, Stripe, Intercom, Amazon, or Google, something about TheFront works for our global partners.
            </Typography>
            <Typography variant="h5" style={{ color: 'white' }}>
              Want more information? Download our overview and a member of our specialist team will be in touch to talk about your goals for TheFront 2020.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Button variant="contained">Download exhibitor overview</Button>
          </Grid>
        </Grid>
      </HeroBackground>
    </Box>
  );
}
`;

const HeroBackgroundExample = ({ ...rest }) => (
  <div {...rest}>
    <SectionBox title="Description" gutterBottom>
      <Headline
        title="HeroBackground"
        path="src/components/organisms/HeroBackground/HeroBackground.js"
        description="Component to display the background hero"
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
          <HeroBackground>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Typography variant="h3" style={{ color: 'white', fontWeight: 900, }}>
                    Join the world's leading companies at TheFront 2020
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h5" style={{ color: 'white' }} gutterBottom>
                    Whether it’s Porsche, Stripe, Intercom, Amazon, or Google, something about TheFront works for our global partners.
                </Typography>
                <Typography variant="h5" style={{ color: 'white' }}>
                    Want more information? Download our overview and a member of our specialist team will be in touch to talk about your goals for TheFront 2020.
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Button variant="contained">Download exhibitor overview</Button>
              </Grid>
            </Grid>
          </HeroBackground>
        </Box>
        <CodeHighlighter code={exampleCode1} />
      </>
    </SectionBox>
    <SectionBox title="Custom Background Color Example" gutterBottom>
      <>
        <Box marginBottom={2} padding={2} border="1px solid #ccc" borderRadius="4px">
          <HeroBackground backgroundColor={colors.blue[500]}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Typography variant="h3" style={{ color: 'white', fontWeight: 900, }}>
                    Join the world's leading companies at TheFront 2020
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h5" style={{ color: 'white' }} gutterBottom>
                    Whether it’s Porsche, Stripe, Intercom, Amazon, or Google, something about TheFront works for our global partners.
                </Typography>
                <Typography variant="h5" style={{ color: 'white' }}>
                    Want more information? Download our overview and a member of our specialist team will be in touch to talk about your goals for TheFront 2020.
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Button variant="contained">Download exhibitor overview</Button>
              </Grid>
            </Grid>
          </HeroBackground>
        </Box>
        <CodeHighlighter code={exampleCode2} />
      </>
    </SectionBox>
    <SectionBox title="Custom Background Image Example" gutterBottom>
      <>
        <Box marginBottom={2} padding={2} border="1px solid #ccc" borderRadius="4px">
          <HeroBackground backgroundImg="https://assets.maccarianagency.com/the-front/photos/expo-gallery/gallery3.jpg">
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Typography variant="h3" style={{ color: 'white', fontWeight: 900, }}>
                  Join the world's leading companies at TheFront 2020
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h5" style={{ color: 'white' }} gutterBottom>
                  Whether it’s Porsche, Stripe, Intercom, Amazon, or Google, something about TheFront works for our global partners.
                </Typography>
                <Typography variant="h5" style={{ color: 'white' }}>
                  Want more information? Download our overview and a member of our specialist team will be in touch to talk about your goals for TheFront 2020.
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Button variant="contained">Download exhibitor overview</Button>
              </Grid>
            </Grid>
          </HeroBackground>
        </Box>
        <CodeHighlighter code={exampleCode3} />
      </>
    </SectionBox>
  </div>
);

export default HeroBackgroundExample;
