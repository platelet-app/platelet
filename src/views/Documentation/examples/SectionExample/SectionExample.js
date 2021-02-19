import React from 'react';
import { Box, Typography } from '@material-ui/core';
import { Headline, CodeHighlighter, PropsHighlighter, SectionBox } from '../../components';
import { Section } from 'components/organisms';

const importCodeString = `
import { Section } from 'components/organisms';
// or
import Section from 'components/organisms/Section';
`;

const dataProperties = [{
  name: 'children',
  type: 'node',
  default: '',
  description: 'Children to placed inside the section',
}, {
  name: 'disablePadding',
  type: 'bool',
  default: '',
  description: 'Should the section render with no padding',
}, {
  name: 'fullWidth',
  type: 'bool',
  default: '',
  description: 'Should the section be full width',
}, {
  name: 'narrow',
  type: 'bool',
  default: '',
  description: 'Should show narrow sections',
}, {
  name: 'className',
  type: 'string',
  default: '',
  description: 'External classes',
}];

const exampleCode = `
import React from 'react';
import { Box, Typography } from '@material-ui/core';
import { Section } from 'components/organisms';

export default function Example() {
  return (
    <Box marginBottom={2} padding={2} border="1px solid #ccc" borderRadius="4px">
      <Section>
        <Typography>This is section with default padding</Typography>
      </Section>
    </Box>
  );
}
`;

const SectionExample = ({ ...rest }) => (
  <div {...rest}>
    <SectionBox title="Description" gutterBottom>
      <Headline
        title="Section"
        path="src/components/organisms/Section/Section.js"
        description="Component to display the sections"
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
          <Section>
            <Typography>This is section with default padding</Typography>
          </Section>
        </Box>
        <CodeHighlighter code={exampleCode} />
      </>
    </SectionBox>
  </div>
);

export default SectionExample;
