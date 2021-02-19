import React from 'react';
import { Box } from '@material-ui/core';
import { Headline, CodeHighlighter, PropsHighlighter, SectionBox } from '../../components';
import { Image } from 'components/atoms';

const importCodeString = `
import { Image } from 'components/atoms';
// or
import Image from 'components/atoms/Image';
`;

const dataProperties = [{
  name: 'src',
  type: 'string',
  default: '',
  description: 'Source of the image',
}, {
  name: 'alt',
  type: 'string',
  default: '...',
  description: 'Image title',
}, {
  name: 'className',
  type: 'string',
  default: '',
  description: 'External classes',
}, {
  name: 'lazy',
  type: 'boolean',
  default: 'true',
  description: 'Should lazy load the image',
}, {
  name: 'lazyProps',
  type: 'object',
  default: '',
  description: 'Lazy loading properties',
}, {
  name: 'srcSet',
  type: 'string',
  default: '',
  description: 'Source set for the responsive images',
}];

const exampleCode = `
import React from 'react';
import { Box } from '@material-ui/core';
import { Image } from 'components/atoms';

export default function Example() {
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" padding={2} border="1px solid #ccc" borderRadius="4px">
      <Image src="https://assets.maccarianagency.com/the-front/illustrations/brand-platform.svg" />
    </Box>
  );
}
`;

const ImageExample = ({ ...rest }) => (
  <div {...rest}>
    <SectionBox title="Description" gutterBottom>
      <Headline
        title="Image"
        path="src/components/atoms/Image/Image.js"
        description="Component to display the images"
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
          <Image src="https://assets.maccarianagency.com/the-front/illustrations/brand-platform.svg" />
        </Box>
        <CodeHighlighter code={exampleCode} />
      </>
    </SectionBox>
  </div>
);

export default ImageExample;
