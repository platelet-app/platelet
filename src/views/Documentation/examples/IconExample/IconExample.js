import React from 'react';
import { Box, colors } from '@material-ui/core';
import { Headline, CodeHighlighter, PropsHighlighter, SectionBox } from '../../components';
import { Icon } from 'components/atoms';

const importCodeString = `
import { Icon } from 'components/atoms';
// or
import Icon from 'components/atoms/Icon';
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
  name: 'fontIconColor',
  type: 'string',
  default: '',
  description: 'Color of the icon',
}, {
  name: 'size',
  type: 'enum',
  default: 'small',
  description: 'Source set for the responsive images. One of: extraSmall, small, medium, large',
}];

const exampleCode = `
import React from 'react';
import { Box, colors } from '@material-ui/core';
import { Icon } from 'components/atoms';

export default function IconExample() {
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" padding={2} border="1px solid #ccc" borderRadius="4px">
      <Icon fontIconClass="fas fa-users" fontIconColor={colors.pink[50]} />
      <Icon fontIconClass="far fa-address-book" size="small" fontIconColor={colors.purple[500]} />
      <Icon fontIconClass="fab fa-angellist" size="medium" fontIconColor={colors.blue[500]} />
      <Icon fontIconClass="fas fa-phone-alt" size="large" fontIconColor={colors.green[500]} />
    </Box>
  );
}
`;

const IconExample = ({ ...rest }) => (
  <div {...rest}>
    <SectionBox title="Description" gutterBottom>
      <Headline
        title="Icon"
        path="src/components/atoms/Icon/Icon.js"
        description="Component to display icons"
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
        <Box marginBottom={2} display="flex" justifyContent="space-between" alignItems="center" padding={2} border="1px solid #ccc" borderRadius="4px">
        <Icon fontIconClass="fas fa-users" fontIconColor={colors.pink[50]} />
        <Icon fontIconClass="far fa-address-book" size="small" fontIconColor={colors.purple[500]} />
        <Icon fontIconClass="fab fa-angellist" size="medium" fontIconColor={colors.blue[500]} />
        <Icon fontIconClass="fas fa-phone-alt" size="large" fontIconColor={colors.green[500]} />
        </Box>
        <CodeHighlighter code={exampleCode} />
      </>
    </SectionBox>
  </div>
);

export default IconExample;
