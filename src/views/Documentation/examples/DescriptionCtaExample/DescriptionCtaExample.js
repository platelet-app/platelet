import React from 'react';
import { Box, Button } from '@material-ui/core';
import { Headline, CodeHighlighter, PropsHighlighter, SectionBox } from '../../components';
import { DescriptionCta } from 'components/molecules';

const importCodeString = `
import { DescriptionCta } from 'components/molecules';
// or
import DescriptionCta from 'components/molecules/DescriptionCta';
`;

const dataProperties = [{
  name: 'primaryCta',
  type: 'node',
  default: '',
  description: 'Primary CTA of the list',
}, {
  name: 'title',
  type: 'string',
  default: '',
  description: 'Title of the list',
}, {
  name: 'align',
  type: 'enum',
  default: 'center',
  description: 'Alignment of the items. One of: left, right, center',
}, {
  name: 'buttonGroupProps',
  type: 'object',
  default: '',
  description: 'Additional properties to pass to the button group div container',
}, {
  name: 'className',
  type: 'string',
  default: '',
  description: 'External classes',
}, {
  name: 'primaryButtonWrapperProps',
  type: 'object',
  default: '',
  description: 'Additional properties to pass to the primary button wrapper div container',
}, {
  name: 'secondaryButtonWrapperProps',
  type: 'object',
  default: '',
  description: 'Additional properties to pass to the secondary button wrapper div container',
}, {
  name: 'secondaryCta',
  type: 'node',
  default: '',
  description: 'Secondary CTA of the list',
}, {
  name: 'subtitle',
  type: 'string',
  default: '',
  description: 'Subtitle of the list',
}, {
  name: 'subtitleProps',
  type: 'object',
  default: '',
  description: 'Additional properties to pass to the subtitle Typography components',
}, {
  name: 'titleProps',
  type: 'object',
  default: '',
  description: 'Additional properties to pass to the title Typography components',
}, {
  name: 'wrapperProps',
  type: 'object',
  default: '',
  description: 'Additional properties to pass to the wrapper Grid item components',
}];

const exampleCode = `
import React from 'react';
import { Box, Button } from '@material-ui/core';
import { DescriptionCta } from 'components/molecules';

export default function Example() {
  return (
    <Box marginBottom={2} display="flex" justifyContent="space-evenly" alignItems="center" padding={2} border="1px solid #ccc" borderRadius="4px">
      <DescriptionCta
          title="Apply in 15 minutes"
          subtitle="Get your dream job without the hassle."
          primaryCta={<Button variant="outlined" color="primary" size="large">Learn More</Button>}
          secondaryCta={<Button variant="contained" color="primary" size="large">Apply now</Button>}
          align="left"
      />
    </Box>
  );
}
`;

const DescriptionCtaExample = ({ ...rest }) => (
  <div {...rest}>
    <SectionBox title="Description" gutterBottom>
      <Headline
        title="DescriptionCta"
        path="src/components/molecules/DescriptionCta/DescriptionCta.js"
        description="Component to display the description with CTA's"
      />
    </SectionBox>
    <SectionBox title="Import" gutterBottom>
      <CodeHighlighter code={importCodeString} />
    </SectionBox>
    <SectionBox title="Props & Methods" gutterBottom>
      <PropsHighlighter dataProperties={dataProperties} />
    </SectionBox>
    <SectionBox title="Example" gutterBottom>
      <>
        <Box marginBottom={2} display="flex" justifyContent="space-evenly" alignItems="center" padding={2} border="1px solid #ccc" borderRadius="4px">
          <DescriptionCta
              title="Apply in 15 minutes"
              subtitle="Get your dream job without the hassle."
              primaryCta={<Button variant="outlined" color="primary" size="large">Learn More</Button>}
              secondaryCta={<Button variant="contained" color="primary" size="large">Apply now</Button>}
              align="left"
          />
        </Box>
        <CodeHighlighter code={exampleCode} />
      </>
    </SectionBox>
  </div>
);

export default DescriptionCtaExample;
