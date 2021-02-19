import React from 'react';
import { Box } from '@material-ui/core';
import { Headline, CodeHighlighter, PropsHighlighter, SectionBox } from '../../components';
import { LearnMoreLink } from 'components/atoms';

const importCodeString = `
import { LearnMoreLink } from 'components/atoms';
// or
import LearnMoreLink from 'components/atoms/LearnMoreLink';
`;

const dataProperties = [{
  name: 'title',
  type: 'string',
  default: '',
  description: 'Title of the link',
}, {
  name: 'className',
  type: 'string',
  default: '',
  description: 'External classes',
}, {
  name: 'color',
  type: 'string',
  default: '',
  description: 'Color of the link',
}, {
  name: 'component',
  type: 'enum',
  default: 'a',
  description: 'The component to load as a main DOM. One of: Link, a',
}, {
  name: 'href',
  type: 'string',
  default: '#',
  description: 'Href of the link',
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
}, {
  name: 'variant',
  type: 'enum',
  default: 'subtitle1',
  description: 'Variant of the link. One of: h6, subtitle1, subtitle2, body1, body2',
}];

const exampleCode = `
import React from 'react';
import { Box } from '@material-ui/core';
import { LearnMoreLink } from 'components/atoms';

export default function Example() {
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" padding={2} border="1px solid #ccc" borderRadius="4px">
      <LearnMoreLink title="learn more" />
    </Box>
  );
}
`;

const LearnMoreLinkExample = ({ ...rest }) => (
  <div {...rest}>
    <SectionBox title="Description" gutterBottom>
      <Headline
        title="LearnMoreLink"
        path="src/components/atoms/LearnMoreLink/LearnMoreLink.js"
        description="Component to display the 'Learn More' link"
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
          <LearnMoreLink title="learn more" />
        </Box>
        <CodeHighlighter code={exampleCode} />
      </>
    </SectionBox>
  </div>
);

export default LearnMoreLinkExample;
