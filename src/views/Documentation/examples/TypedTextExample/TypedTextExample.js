import React from 'react';
import { Box } from '@material-ui/core';
import { Headline, CodeHighlighter, PropsHighlighter, SectionBox } from '../../components';
import { TypedText } from 'components/molecules';

const importCodeString = `
import { TypedText } from 'components/molecules';
// or
import TypedText from 'components/molecules/TypedText';
`;

const dataProperties = [{
  name: 'typedProps',
  type: 'object',
  default: '',
  description: 'react-typed properties. For more info visit https://www.npmjs.com/package/react-typed',
}, {
  name: 'className',
  type: 'string',
  default: '',
  description: 'External classes',
}];

const exampleCode = `
import React from 'react';
import { Box } from '@material-ui/core';
import { TypedText } from 'components/molecules';

export default function Example() {
  return (
    <Box marginBottom={2} display="flex" justifyContent="space-evenly" alignItems="center" padding={2} border="1px solid #ccc" borderRadius="4px">
      <TypedText
        component="span"
        variant="h4"
        color="secondary"
        typedProps={{
            strings: [ "Web Developers.", "UI/UX Designers.", "Business Analists.", "Scrum Masters.", "Finance & Sales" ],
            typeSpeed: 50,
            loop: true,
        }}
      />
    </Box>
  );
}
`;

const TypedTextExample = ({ ...rest }) => (
  <div {...rest}>
    <SectionBox title="Description" gutterBottom>
      <Headline
        title="TypedText"
        path="src/components/molecules/TypedText/TypedText.js"
        description="Component to display the typed animated texts"
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
          <TypedText
            component="span"
            variant="h4"
            color="secondary"
            typedProps={{
                strings: [ "Web Developers.", "UI/UX Designers.", "Business Analists.", "Scrum Masters.", "Finance & Sales" ],
                typeSpeed: 50,
                loop: true,
            }}
          />
        </Box>
        <CodeHighlighter code={exampleCode} />
      </>
    </SectionBox>
  </div>
);

export default TypedTextExample;
