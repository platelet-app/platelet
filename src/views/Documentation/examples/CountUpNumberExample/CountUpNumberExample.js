import React from 'react';
import { Box } from '@material-ui/core';
import { Headline, CodeHighlighter, PropsHighlighter, SectionBox } from '../../components';
import { CountUpNumber } from 'components/molecules';

const importCodeString = `
import { CountUpNumber } from 'components/molecules';
// or
import CountUpNumber from 'components/molecules/CountUpNumber';
`;

const dataProperties = [{
  name: 'end',
  type: 'number',
  default: '',
  description: 'The final number',
}, {
  name: 'label',
  type: 'string',
  default: '',
  description: 'The label text of the count up number',
}, {
  name: 'className',
  type: 'string',
  default: '',
  description: 'External classes',
}, {
  name: 'countNumberProps',
  type: 'object',
  default: '',
  description: 'Additional properties to pass to the CountUp React component',
}, {
  name: 'countWrapperProps',
  type: 'object',
  default: '',
  description: 'Additional properties to pass to the count wrapper Typography component',
}, {
  name: 'labelColor',
  type: 'string',
  default: '',
  description: 'Label color',
}, {
  name: 'labelProps',
  type: 'object',
  default: '',
  description: 'Additional properties to pass to the label Typography component',
}, {
  name: 'prefix',
  type: 'string',
  default: '',
  description: 'The Prefix of the count up number',
}, {
  name: 'start',
  type: 'number',
  default: '0',
  description: 'Starting number',
}, {
  name: 'suffix',
  type: 'string',
  default: '',
  description: 'The Suffix of the count up number',
}, {
  name: 'textColor',
  type: 'string',
  default: '',
  description: 'Text color',
}, {
  name: 'visibilitySensorProps',
  type: 'object',
  default: '',
  description: 'Additional properties to pass to the VisibilitySensor Component',
}, {
  name: 'wrapperProps',
  type: 'object',
  default: '',
  description: 'Additional properties to pass to the wrapper div',
}];

const exampleCode = `
import React from 'react';
import { Box } from '@material-ui/core';
import { CountUpNumber } from 'components/molecules';

export default function Example() {
  return (
    <Box marginBottom={2} padding={2} border="1px solid #ccc" borderRadius="4px" overflow="auto">
      <Box display="flex" justifyContent="space-around" alignItems="center" minWidth="600px">
        <CountUpNumber end={458} suffix="K" label="Placement" />
        <CountUpNumber end={360} prefix="$" suffix="K" label="Money Invested" />
        <CountUpNumber end={80} suffix="+" label="Locations" />
      </Box>
    </Box>
  );
}
`;

const CountUpNumberExample = ({ ...rest }) => (
  <div {...rest}>
    <SectionBox title="Description" gutterBottom>
      <Headline
        title="CountUpNumber"
        path="src/components/molecules/CountUpNumber/CountUpNumber.js"
        description="Component to display the Count Up Numbers"
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
        <Box marginBottom={2} padding={2} border="1px solid #ccc" borderRadius="4px" overflow="auto">
          <Box display="flex" justifyContent="space-around" alignItems="center" minWidth="600px">
            <CountUpNumber end={458} suffix="K" label="Placement" />
            <CountUpNumber end={360} prefix="$" suffix="K" label="Money Invested" />
            <CountUpNumber end={80} suffix="+" label="Locations" />
          </Box>
        </Box>
        <CodeHighlighter code={exampleCode} />
      </>
    </SectionBox>
  </div>
);

export default CountUpNumberExample;
