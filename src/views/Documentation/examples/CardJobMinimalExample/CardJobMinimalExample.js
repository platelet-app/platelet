import React from 'react';
import { Box } from '@material-ui/core';
import { Headline, CodeHighlighter, PropsHighlighter, SectionBox } from '../../components';
import { CardJobMinimal } from 'components/organisms';

const importCodeString = `
import { CardJobMinimal } from 'components/organisms';
// or
import CardJobMinimal from 'components/organisms/CardJobMinimal';
`;

const dataProperties = [{
  name: 'subtitle',
  type: 'string',
  default: '',
  description: 'Job subtitle of the card',
}, {
  name: 'title',
  type: 'string',
  default: '',
  description: 'Job title of the card',
}, {
  name: 'showArrow',
  type: 'bool',
  default: 'false',
  description: 'Should show arrow or not',
}, {
  name: 'subtitleProps',
  type: 'object',
  default: '',
  description: 'Additional props to pass to the subtitle Typography component',
}, {
  name: 'titleProps',
  type: 'object',
  default: '',
  description: 'Additional props to pass to the title Typography component',
}, {
  name: 'className',
  type: 'string',
  default: '',
  description: 'External classes',
}];

const exampleCode1 = `
import React from 'react';
import { Box } from '@material-ui/core';
import { CardJobMinimal } from 'components/organisms';

export default function Example() {
  return (
    <Box marginBottom={2} padding={2} border="1px solid #ccc" borderRadius="4px">
      <CardJobMinimal
        title={'Front-end developer'}
        subtitle={'Paris / Full time'}
      />
    </Box>
  );
}
`;

const exampleCode2 = `
import React from 'react';
import { Box } from '@material-ui/core';
import { CardJobMinimal } from 'components/organisms';

export default function Example() {
  return (
    <Box marginBottom={2} padding={2} border="1px solid #ccc" borderRadius="4px">
      <CardJobMinimal
        title={'Front-end developer'}
        subtitle={'Paris / Full time'}
        showArrow
        titleProps={{
            variant: 'h6',
        }}
        subtitleProps={{
            variant: 'subtitle1',
        }}
      />
    </Box>
  );
}
`;

const CardJobMinimalExample = ({ ...rest }) => (
  <div {...rest}>
    <SectionBox title="Description" gutterBottom>
      <Headline
        title="CardJobMinimal"
        path="src/components/organisms/CardJobMinimal/CardJobMinimal.js"
        description="Component to display the job minimal card"
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
          <CardJobMinimal
            title={'Front-end developer'}
            subtitle={`Paris / Full time`}
          />
        </Box>
        <CodeHighlighter code={exampleCode1} />
      </>
    </SectionBox>
    <SectionBox title="Outlined" gutterBottom>
      <>
        <Box marginBottom={2} padding={2} border="1px solid #ccc" borderRadius="4px">
          <CardJobMinimal
            title={'Front-end developer'}
            subtitle={`Paris / Full time`}
            showArrow
            titleProps={{
                variant: 'h6',
            }}
            subtitleProps={{
                variant: 'subtitle1',
            }}
          />
        </Box>
        <CodeHighlighter code={exampleCode2} />
      </>
    </SectionBox>
  </div>
);

export default CardJobMinimalExample;
