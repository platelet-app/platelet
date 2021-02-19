import React from 'react';
import { Box, Button } from '@material-ui/core';
import { Headline, CodeHighlighter, PropsHighlighter, SectionBox } from '../../components';
import { HeroShaped } from 'components/organisms';
import { Image } from 'components/atoms';
import { SectionHeader } from 'components/molecules';

const importCodeString = `
import { HeroShaped } from 'components/organisms';
// or
import HeroShaped from 'components/organisms/HeroShaped';
`;

const dataProperties = [{
  name: 'leftSide',
  type: 'node',
  default: '',
  description: 'Children to placed inside the section left side',
}, {
  name: 'rightSide',
  type: 'node',
  default: '',
  description: 'Children to placed inside the section right side',
}, {
  name: 'className',
  type: 'string',
  default: '',
  description: 'External classes',
}];

const exampleCode = `
import React from 'react';
import { Box, Button } from '@material-ui/core';
import { HeroShaped } from 'components/organisms';
import { Image } from 'components/atoms';
import { SectionHeader } from 'components/molecules';

export default function Example() {
  return (
    <Box marginBottom={2} padding={2} border="1px solid #ccc" borderRadius="4px">
      <HeroShaped
        leftSide={(
          <SectionHeader
            title="Coworking made easy"
            subtitle="For entrepreneurs, startups and freelancers. Discover coworking spaces designed to inspire and to connect you to a community of motivated people."
            ctaGroup={[
              <Button variant="contained" color="primary">Book</Button>,
              <Button variant="outlined" color="primary">Browse</Button>
            ]}
            align="left"
          />
        )}
        rightSide={(
          <Image src="https://assets.maccarianagency.com/the-front/photos/coworking/place1.jpg" alt="..." style={{ objectFit: 'cover' }} lazy={false} />
        )}
      />
    </Box>
  );
}
`;

const HeroShapedExample = ({ ...rest }) => (
  <div {...rest}>
    <SectionBox title="Description" gutterBottom>
      <Headline
        title="HeroShaped"
        path="src/components/organisms/HeroShaped/HeroShaped.js"
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
          <HeroShaped
            leftSide={(
              <SectionHeader
                title="Coworking made easy"
                subtitle="For entrepreneurs, startups and freelancers. Discover coworking spaces designed to inspire and to connect you to a community of motivated people."
                ctaGroup={[
                  <Button variant="contained" color="primary">Book</Button>,
                  <Button variant="outlined" color="primary">Browse</Button>
                ]}
                align="left"
              />
            )}
            rightSide={(
              <Image src="https://assets.maccarianagency.com/the-front/photos/coworking/place1.jpg" alt="..." style={{ objectFit: 'cover' }} lazy={false} />
            )}
          />
        </Box>
        <CodeHighlighter code={exampleCode} />
      </>
    </SectionBox>
  </div>
);

export default HeroShapedExample;
