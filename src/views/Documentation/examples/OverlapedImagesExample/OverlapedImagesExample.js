import React from 'react';
import { Box } from '@material-ui/core';
import { Headline, CodeHighlighter, PropsHighlighter, SectionBox } from '../../components';
import { OverlapedImages } from 'components/molecules';

const importCodeString = `
import { OverlapedImages } from 'components/molecules';
// or
import OverlapedImages from 'components/molecules/OverlapedImages';
`;

const dataProperties = [{
  name: 'image1',
  type: 'object',
  default: '',
  description: 'Image item - Object of src, srcset and alt properties',
}, {
  name: 'image2',
  type: 'object',
  default: '',
  description: 'Image item - Object of src, srcset and alt properties',
}, {
  name: 'image3',
  type: 'object',
  default: '',
  description: 'Image item - Object of src, srcset and alt properties',
}, {
  name: 'className',
  type: 'string',
  default: '',
  description: 'External classes',
}];

const exampleCode = `
import React from 'react';
import { Box } from '@material-ui/core';
import { OverlapedImages } from 'components/molecules';

export default function Example() {
  return (
    <Box marginBottom={2} display="flex" justifyContent="space-evenly" alignItems="center" padding={2} border="1px solid #ccc" borderRadius="4px">
      <OverlapedImages
        image1={{
            src: 'https://assets.maccarianagency.com/the-front/photos/expo-gallery/gallery1.jpg',
            srcSet: 'https://assets.maccarianagency.com/the-front/photos/expo-gallery/gallery1@2x.jpg 2x',
            alt: '...',
        }}
        image2={{
            src: 'https://assets.maccarianagency.com/the-front/photos/expo-gallery/gallery2.jpg',
            srcSet: 'https://assets.maccarianagency.com/the-front/photos/expo-gallery/gallery2@2x.jpg 2x',
            alt: '...',
        }}
        image3={{
            src: 'https://assets.maccarianagency.com/the-front/photos/expo-gallery/gallery3.jpg',
            srcSet: 'https://assets.maccarianagency.com/the-front/photos/expo-gallery/gallery3@2x.jpg 2x',
            alt: '...',
        }}
      />
    </Box>
  );
}
`;

const OverlapedImagesExample = ({ ...rest }) => (
  <div {...rest}>
    <SectionBox title="Description" gutterBottom>
      <Headline
        title="OverlapedImages"
        path="src/components/molecules/OverlapedImages/OverlapedImages.js"
        description="Component to display the overlaped images"
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
          <OverlapedImages
            image1={{
                src: 'https://assets.maccarianagency.com/the-front/photos/expo-gallery/gallery1.jpg',
                srcSet: 'https://assets.maccarianagency.com/the-front/photos/expo-gallery/gallery1@2x.jpg 2x',
                alt: '...',
            }}
            image2={{
                src: 'https://assets.maccarianagency.com/the-front/photos/expo-gallery/gallery2.jpg',
                srcSet: 'https://assets.maccarianagency.com/the-front/photos/expo-gallery/gallery2@2x.jpg 2x',
                alt: '...',
            }}
            image3={{
                src: 'https://assets.maccarianagency.com/the-front/photos/expo-gallery/gallery3.jpg',
                srcSet: 'https://assets.maccarianagency.com/the-front/photos/expo-gallery/gallery3@2x.jpg 2x',
                alt: '...',
            }}
          />
        </Box>
        <CodeHighlighter code={exampleCode} />
      </>
    </SectionBox>
  </div>
);

export default OverlapedImagesExample;
