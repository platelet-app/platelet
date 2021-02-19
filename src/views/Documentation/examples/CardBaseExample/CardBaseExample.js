import React from 'react';
import { Box, Typography } from '@material-ui/core';
import { Headline, CodeHighlighter, PropsHighlighter, SectionBox } from '../../components';
import { CardBase } from 'components/organisms';

const importCodeString = `
import { CardBase } from 'components/organisms';
// or
import CardBase from 'components/organisms/CardBase';
`;

const dataProperties = [{
  name: 'children',
  type: 'node',
  default: '',
  description: 'The children content of the basic card',
}, {
  name: 'align',
  type: 'enum',
  default: 'center',
  description: 'The content alignment. One of: left, right, center',
}, {
  name: 'cardContentProps',
  type: 'object',
  default: '',
  description: 'Additional props to pass to the CardContent component',
}, {
  name: 'className',
  type: 'string',
  default: '',
  description: 'External classes',
}, {
  name: 'liftUp',
  type: 'bool',
  default: '',
  description: 'Whether to lift up on hover',
}, {
  name: 'noBg',
  type: 'bool',
  default: '',
  description: 'Whether to show transparent background',
}, {
  name: 'noBorder',
  type: 'bool',
  default: '',
  description: 'Whether to hide the card borders',
}, {
  name: 'noShadow',
  type: 'bool',
  default: '',
  description: 'Whether to render the card without shadow',
}, {
  name: 'withShadow',
  type: 'bool',
  default: '',
  description: 'Whether to show custom shadow',
}];

const exampleCode1 = `
import React from 'react';
import { Box, Typography } from '@material-ui/core';
import { CardBase } from 'components/organisms';

export default function Example() {
  return (
    <Box marginBottom={2} display="flex" justifyContent="space-evenly" alignItems="center" padding={2} border="1px solid #ccc" borderRadius="4px">
      <CardBase>
        <Typography variant="h6">This is basic card</Typography>
      </CardBase>
    </Box>
  );
}
`;

const exampleCode2 = `
import React from 'react';
import { Box, Typography } from '@material-ui/core';
import { CardBase } from 'components/organisms';

export default function Example() {
  return (
    <Box marginBottom={2} display="flex" justifyContent="space-evenly" alignItems="center" padding={2} border="1px solid #ccc" borderRadius="4px">
      <CardBase withShadow>
        <Typography variant="h6">This is basic card with custom shadows</Typography>
      </CardBase>
    </Box>
  );
}
`;

const exampleCode3 = `
import React from 'react';
import { Box, Typography } from '@material-ui/core';
import { CardBase } from 'components/organisms';

export default function Example() {
  return (
    <Box marginBottom={2} display="flex" justifyContent="space-evenly" alignItems="center" padding={2} border="1px solid #ccc" borderRadius="4px">
      <CardBase withShadow liftUp>
        <Typography variant="h6">This is basic card will lift up on hover</Typography>
      </CardBase>
    </Box>
  );
}
`;

const exampleCode4 = `
import React from 'react';
import { Box, Typography } from '@material-ui/core';
import { CardBase } from 'components/organisms';

export default function Example() {
  return (
    <Box marginBottom={2} display="flex" justifyContent="space-evenly" alignItems="center" padding={2} border="1px solid #ccc" borderRadius="4px">
      <CardBase noBorder noShadow>
        <Typography variant="h6">This is basic card without border and without shadow</Typography>
      </CardBase>
    </Box>
  );
}
`;

const exampleCode5 = `
import React from 'react';
import { Box, Typography } from '@material-ui/core';
import { CardBase } from 'components/organisms';

export default function Example() {
  return (
    <Box marginBottom={2} display="flex" justifyContent="space-evenly" alignItems="center" padding={2} border="1px solid #ccc" borderRadius="4px">
      <CardBase variant="outlined">
        <Typography variant="h6">This is basic card with outlined effect</Typography>
      </CardBase>
    </Box>
  );
}
`;

const CardBaseExample = ({ ...rest }) => (
  <div {...rest}>
    <SectionBox title="Description" gutterBottom>
      <Headline
        title="CardBase"
        path="src/components/organisms/CardBase/CardBase.js"
        description="Component to display the basic card"
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
        <Box marginBottom={2} display="flex" justifyContent="space-evenly" alignItems="center" padding={2} border="1px solid #ccc" borderRadius="4px">
          <CardBase>
            <Typography variant="h6">This is basic card</Typography>
          </CardBase>
        </Box>
        <CodeHighlighter code={exampleCode1} />
      </>
    </SectionBox>
    <SectionBox title="Custom Shadow Example" gutterBottom>
      <>
        <Box marginBottom={2} display="flex" justifyContent="space-evenly" alignItems="center" padding={2} border="1px solid #ccc" borderRadius="4px">
          <CardBase withShadow>
            <Typography variant="h6">This is basic card with custom shadows</Typography>
          </CardBase>
        </Box>
        <CodeHighlighter code={exampleCode2} />
      </>
    </SectionBox>
    <SectionBox title="Hover lift up" gutterBottom>
      <>
        <Box marginBottom={2} display="flex" justifyContent="space-evenly" alignItems="center" padding={2} border="1px solid #ccc" borderRadius="4px">
          <CardBase withShadow liftUp>
            <Typography variant="h6">This is basic card will lift up on hover</Typography>
          </CardBase>
        </Box>
        <CodeHighlighter code={exampleCode3} />
      </>
    </SectionBox>
    <SectionBox title="No border, no shadow" gutterBottom>
      <>
        <Box marginBottom={2} display="flex" justifyContent="space-evenly" alignItems="center" padding={2} border="1px solid #ccc" borderRadius="4px">
          <CardBase noBorder noShadow>
            <Typography variant="h6">This is basic card without border and without shadow</Typography>
          </CardBase>
        </Box>
        <CodeHighlighter code={exampleCode4} />
      </>
    </SectionBox>
    <SectionBox title="Outlined" gutterBottom>
      <>
        <Box marginBottom={2} display="flex" justifyContent="space-evenly" alignItems="center" padding={2} border="1px solid #ccc" borderRadius="4px">
          <CardBase variant="outlined">
            <Typography variant="h6">This is basic card with outlined effect</Typography>
          </CardBase>
        </Box>
        <CodeHighlighter code={exampleCode5} />
      </>
    </SectionBox>
  </div>
);

export default CardBaseExample;
