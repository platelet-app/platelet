import React from 'react';
import { Box, colors } from '@material-ui/core';
import { Headline, CodeHighlighter, PropsHighlighter, SectionBox } from '../../components';
import { IconAlternate } from 'components/molecules';

const importCodeString = `
import { IconAlternate } from 'components/molecules';
// or
import IconAlternate from 'components/molecules/IconAlternate';
`;

const dataProperties = [{
  name: 'fontIconClass',
  type: 'string',
  default: '',
  description: 'The classes of the font icon',
}, {
  name: 'className',
  type: 'string',
  default: '',
  description: 'External classes',
}, {
  name: 'color',
  type: 'enum',
  default: '',
  description: 'Color of the icon. One of: colors.red, colors.pink, colors.purple, colors.deepPurple, colors.indigo, colors.blue, colors.lightBlue, colors.cyan, colors.teal, colors.green, colors.lightGreen, colors.lime, colors.yellow, colors.amber, colors.orange, colors.deepOrange, colors.brown, colors.grey, colors.blueGrey',
}, {
  name: 'iconProps',
  type: 'object',
  default: '',
  description: 'Additional properties to pass to the Icon component',
}, {
  name: 'shape',
  type: 'enum',
  default: '',
  description: 'The shape of the alternate icon. One of: circle, square',
}, {
  name: 'size',
  type: 'enum',
  default: 'medium',
  description: 'Sizes of the icon. One of: extraSmall, small, medium, large',
}];

const exampleCode = `
import React from 'react';
import { Box, colors } from '@material-ui/core';
import { IconAlternate } from 'components/molecules';

export default function Example() {
  return (
    <Box marginBottom={2} padding={2} border="1px solid #ccc" borderRadius="4px" overflow="auto">
      <Box display="flex" justifyContent="space-around" alignItems="center" minWidth="600px">
        <IconAlternate shape="circle" size="small" fontIconClass="far fa-address-book" color={colors.purple} />
        <IconAlternate fontIconClass="fas fa-users" color={colors.pink} />
        <IconAlternate fontIconClass="fas fa-quote-right" size="medium" color={colors.blue} />
        <IconAlternate fontIconClass="fas fa-phone-alt" size="large" color={colors.green} />
      </Box>
    </Box>
  );
}
`;

const IconAlternateExample = ({ ...rest }) => (
  <div {...rest}>
    <SectionBox title="Description" gutterBottom>
      <Headline
        title="IconAlternate"
        path="src/components/molecules/IconAlternate/IconAlternate.js"
        description="Component to display the alternate icon"
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
            <IconAlternate shape="circle" size="small" fontIconClass="far fa-address-book" color={colors.purple} />
            <IconAlternate fontIconClass="fas fa-users" color={colors.pink} />
            <IconAlternate fontIconClass="fas fa-quote-right" size="medium" color={colors.blue} />
            <IconAlternate fontIconClass="fas fa-phone-alt" size="large" color={colors.green} />
          </Box>
        </Box>
        <CodeHighlighter code={exampleCode} />
      </>
    </SectionBox>
  </div>
);

export default IconAlternateExample;
