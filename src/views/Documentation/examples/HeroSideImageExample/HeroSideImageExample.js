import React from 'react';
import { Box, Grid, Typography } from '@material-ui/core';
import { Headline, CodeHighlighter, PropsHighlighter, SectionBox } from '../../components';
import { HeroSideImage } from 'components/organisms';

const importCodeString = `
import { HeroSideImage } from 'components/organisms';
// or
import HeroSideImage from 'components/organisms/HeroSideImage';
`;

const dataProperties = [{
  name: 'imageSrc',
  type: 'string',
  default: '',
  description: 'Side image',
}, {
  name: 'backgroundColor',
  type: 'string',
  default: '',
  description: 'Background color of the hero',
}, {
  name: 'children',
  type: 'node',
  default: '',
  description: 'Children to placed inside the hero',
}, {
  name: 'imageSrcSet',
  type: 'string',
  default: '',
  description: 'Side image srcset',
}, {
  name: 'reverse',
  type: 'bool',
  default: '',
  description: 'Should show in reverse order',
}, {
  name: 'className',
  type: 'string',
  default: '',
  description: 'External classes',
}];

const exampleCode1 = `
import React from 'react';
import { Box, Grid, Typography } from '@material-ui/core';
import { HeroSideImage } from 'components/organisms';

export default function Example() {
  return (
    <Box marginBottom={2} padding={2} border="1px solid #ccc" borderRadius="4px">
      <HeroSideImage imageSrc="https://assets.maccarianagency.com/the-front/photos/expo-gallery/gallery1.jpg">
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Typography variant="h4" style={{ color: isMd ? 'inherit' : 'white' }}>
              Join the world's leading companies at TheFront 2020
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" style={{ color: isMd ? 'inherit' : 'white' }}>
              Download our overview and a member of our specialist team will be in touch.
            </Typography>
          </Grid>
        </Grid>
      </HeroSideImage>
    </Box>
  );
}
`;

const exampleCode2 = `
import React from 'react';
import { Box, Grid, Typography } from '@material-ui/core';
import { HeroSideImage } from 'components/organisms';

export default function Example() {
  return (
    <Box marginBottom={2} padding={2} border="1px solid #ccc" borderRadius="4px">
      <HeroSideImage imageSrc="https://assets.maccarianagency.com/the-front/photos/expo-gallery/gallery2.jpg" reverse>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Typography variant="h4">
              Join the world's leading companies at TheFront 2020
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">
              Download our overview and a member of our specialist team will be in touch.
            </Typography>
          </Grid>
        </Grid>
      </HeroSideImage>
    </Box>
  );
}
`;

const HeroSideImageExample = ({ ...rest }) => (
  <div {...rest}>
    <SectionBox title="Description" gutterBottom>
      <Headline
        title="HeroSideImage"
        path="src/components/organisms/HeroSideImage/HeroSideImage.js"
        description="Component to display the side image hero"
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
          <HeroSideImage imageSrc="https://assets.maccarianagency.com/the-front/photos/expo-gallery/gallery1.jpg">
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Typography variant="h4">
                  Join the world's leading companies at TheFront 2020
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6">
                  Download our overview and a member of our specialist team will be in touch.
                </Typography>
              </Grid>
            </Grid>
          </HeroSideImage>
        </Box>
        <CodeHighlighter code={exampleCode1} />
      </>
    </SectionBox>
    <SectionBox title="Reverse Order Example" gutterBottom>
      <>
        <Box marginBottom={2} padding={2} border="1px solid #ccc" borderRadius="4px">
          <HeroSideImage imageSrc="https://assets.maccarianagency.com/the-front/photos/expo-gallery/gallery2.jpg" reverse>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Typography variant="h4">
                  Join the world's leading companies at TheFront 2020
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6">
                  Download our overview and a member of our specialist team will be in touch.
                </Typography>
              </Grid>
            </Grid>
          </HeroSideImage>
        </Box>
        <CodeHighlighter code={exampleCode2} />
      </>
    </SectionBox>
  </div>
);

export default HeroSideImageExample;
