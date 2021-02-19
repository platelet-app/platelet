import React from 'react';
import { Box, Typography } from '@material-ui/core';
import { Headline, CodeHighlighter, PropsHighlighter, SectionBox } from '../../components';
import { Parallax } from 'components/organisms';
import { SectionHeader } from 'components/molecules';
import { CardBase } from 'components/organisms';

const importCodeString = `
import { Parallax } from 'components/organisms';
// or
import Parallax from 'components/organisms/Parallax';
`;

const dataProperties = [{
  name: 'backgroundImage',
  type: 'string',
  default: '',
  description: 'The parallax background image',
}, {
  name: 'children',
  type: 'node',
  default: '',
  description: 'The content',
}, {
  name: 'className',
  type: 'string',
  default: '',
  description: 'External classes',
}];

const exampleCode = `
import React from 'react';
import { Box, Typography } from '@material-ui/core';
import { Parallax } from 'components/organisms';
import { SectionHeader } from 'components/molecules';
import { CardBase } from 'components/organisms';

export default function Example() {
  return (
    <Box marginBottom={2} padding={2} border="1px solid #ccc" borderRadius="4px">
      <Parallax backgroundImage="https://assets.maccarianagency.com/the-front/photos/blog/cover2.jpg">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#007b3d3d' }}>
          <CardBase withShadow style={{ width: 500, height: 'auto', background: 'transparent' }}>
            <SectionHeader
              title={
                <span style={{ color: 'white' }}>
                  Use flexible components.<br />
                  <Typography component="span" variant="inherit" color="primary">
                  to build an app quickly.
                  </Typography>
                </span>
              }
              subtitle={<span style={{ color: 'white' }}>
                TheFront styles and extends Material UI components, but also included brand new landing page focused components.
              </span>}
            />
          </CardBase>
        </div>
      </Parallax>
    </Box>
  );
}
`;

const ParallaxExample = ({ ...rest }) => (
  <div {...rest}>
    <SectionBox title="Description" gutterBottom>
      <Headline
        title="Parallax"
        path="src/components/organisms/Parallax/Parallax.js"
        description="Component to display the Parallax backgrounds"
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
        <Box marginBottom={2} padding={2} border="1px solid #ccc" borderRadius="4px" position="relative">
          <Parallax backgroundImage="https://assets.maccarianagency.com/the-front/photos/blog/cover2.jpg">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#007b3d3d' }}>
              <CardBase withShadow style={{ width: 500, height: 'auto', background: 'transparent' }}>
                <SectionHeader
                  title={
                    <span style={{ color: 'white' }}>
                      Use flexible components.<br />
                      <Typography component="span" variant="inherit" color="primary">
                      to build an app quickly.
                      </Typography>
                    </span>
                  }
                  subtitle={<span style={{ color: 'white' }}>
                    TheFront styles and extends Material UI components, but also included brand new landing page focused components.
                  </span>}
                />
              </CardBase>
            </div>
          </Parallax>
        </Box>
        <CodeHighlighter code={exampleCode} />
      </>
    </SectionBox>
  </div>
);

export default ParallaxExample;
