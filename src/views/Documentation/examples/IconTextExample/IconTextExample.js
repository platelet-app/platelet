import React from 'react';
import { Box, colors } from '@material-ui/core';
import { Headline, CodeHighlighter, PropsHighlighter, SectionBox } from '../../components';
import { IconText } from 'components/atoms';

const importCodeString = `
import { IconText } from 'components/atoms';
// or
import IconText from 'components/atoms/IconText';
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
  type: 'string',
  default: '',
  description: 'Source set for the responsive images',
}, {
  name: 'title',
  type: 'string',
  default: '',
  description: 'Title of the icon-text',
}, {
  name: 'iconProps',
  type: 'object',
  default: '',
  description: 'Additional properties to pass to the Icon component',
}, {
  name: 'typographyProps',
  type: 'object',
  default: '',
  description: 'Additional properties to pass to the Typography component',
}];

const exampleCode = `
import React from 'react';
import { Box, colors } from '@material-ui/core';
import { IconText } from 'components/atoms';

export default function IconExample() {
  return (
    <Box padding={2} border="1px solid #ccc" borderRadius="4px" overflow="auto">
      <Box display="flex" justifyContent="space-between" alignItems="center" minWidth="650px">
        <IconText fontIconClass="fas fa-users" color={colors.pink[50]} title="Users Icon Text" />
        <IconText fontIconClass="far fa-address-book" color={colors.purple[500]} title="Book Icon Text" />
        <IconText fontIconClass="fab fa-angellist" color={colors.blue[500]} title="Cool Icon Text" />
        <IconText fontIconClass="fas fa-phone-alt"  color={colors.green[500]} title="Phone Icon Text" />
      </Box>
    </Box>
  );
}
`;

const IconTextExample = ({ ...rest }) => (
  <div {...rest}>
    <SectionBox title="Description" gutterBottom>
      <Headline
        title="IconText"
        path="src/components/atoms/IconText/IconText.js"
        description="Component to display the icon text"
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
          <Box display="flex" justifyContent="space-between" alignItems="center" minWidth="650px">
            <IconText fontIconClass="fas fa-users" color={colors.pink[50]} title="Users Icon Text" />
            <IconText fontIconClass="far fa-address-book" color={colors.purple[500]} title="Book Icon Text" />
            <IconText fontIconClass="fab fa-angellist" color={colors.blue[500]} title="Cool Icon Text" />
            <IconText fontIconClass="fas fa-phone-alt"  color={colors.green[500]} title="Phone Icon Text" />
          </Box>
        </Box>
        <CodeHighlighter code={exampleCode} />
      </>
    </SectionBox>
  </div>
);

export default IconTextExample;
