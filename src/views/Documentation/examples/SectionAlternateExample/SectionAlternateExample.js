import React from 'react';
import { Box, Typography } from '@material-ui/core';
import { Headline, CodeHighlighter, PropsHighlighter, SectionBox } from '../../components';
import { SectionAlternate } from 'components/organisms';

const importCodeString = `
import { SectionAlternate } from 'components/organisms';
// or
import SectionAlternate from 'components/organisms/SectionAlternate';
`;

const dataProperties = [{
  name: 'children',
  type: 'node',
  default: '',
  description: 'Children to placed inside the section',
}, {
  name: 'innerNarrowed',
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
import { SectionAlternate } from 'components/organisms';

export default function Example() {
  return (
    <Box marginBottom={2} padding={2} border="1px solid #ccc" borderRadius="4px">
      <SectionAlternate>
        <Typography>This is section with default padding</Typography>
      </SectionAlternate>
    </Box>
  );
}
`;

const SectionAlternateExample = ({ ...rest }) => (
  <div {...rest}>
    <SectionBox title="Description" gutterBottom>
      <Headline
        title="SectionAlternate"
        path="src/components/organisms/SectionAlternate/SectionAlternate.js"
        description="Component to display the alternative sections"
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
          <SectionAlternate>
            <Typography>This is section with default padding</Typography>
          </SectionAlternate>
        </Box>
        <CodeHighlighter code={exampleCode} />
      </>
    </SectionBox>
  </div>
);

export default SectionAlternateExample;
