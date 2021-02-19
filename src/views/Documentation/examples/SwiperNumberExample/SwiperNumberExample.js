import React from 'react';
import { Box } from '@material-ui/core';
import { Headline, CodeHighlighter, PropsHighlighter, SectionBox } from '../../components';
import { SwiperNumber } from 'components/molecules';

const importCodeString = `
import { SwiperNumber } from 'components/molecules';
// or
import SwiperNumber from 'components/molecules/SwiperNumber';
`;

const dataProperties = [{
  name: 'items',
  type: 'object[]',
  default: '',
  description: 'The array of numbers object which should consist of number and title',
}, {
  name: 'className',
  type: 'string',
  default: '',
  description: 'External classes',
}, {
  name: 'labelProps',
  type: 'object',
  default: '',
  description: 'The additional properties to pass to the label Typography component',
}, {
  name: 'numberProps',
  type: 'object',
  default: '',
  description: 'The additional properties to pass to the number Typography component',
}];

const exampleCode = `
import React from 'react';
import { Box } from '@material-ui/core';
import { SwiperNumber } from 'components/molecules';
import 'swiper/css/swiper.min.css';

export default function Example() {
  return (
    <Box marginBottom={2} display="flex" justifyContent="space-evenly" alignItems="center" padding={2} border="1px solid #ccc" borderRadius="4px">
      <SwiperNumber
        items={[{
            title: 'attendees',
            number: '70,000+'
        }, {
            title: 'countries',
            number: '160+'
        }, {
            title: 'speakers',
            number: '1,200+'
        }, {
            title: 'journalists',
            number: '2,500+'
        }, {
            title: 'CEO's',
            number: '11,000+'
        }, {
            title: 'fimale',
            number: '46%'
        }, {
            title: 'investors',
            number: '1,200+'
        }]}
      />
    </Box>
  );
}
`;

const SwiperNumberExample = ({ ...rest }) => (
  <div {...rest}>
    <SectionBox title="Description" gutterBottom>
      <Headline
        title="SwiperNumber"
        path="src/components/molecules/SwiperNumber/SwiperNumber.js"
        description="Component to display the number swiper"
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
          <SwiperNumber
            items={[{
                title: 'attendees',
                number: '70,000+'
            }, {
                title: 'countries',
                number: '160+'
            }, {
                title: 'speakers',
                number: '1,200+'
            }, {
                title: 'journalists',
                number: '2,500+'
            }, {
                title: 'CEO\'s',
                number: '11,000+'
            }, {
                title: 'fimale',
                number: '46%'
            }, {
                title: 'investors',
                number: '1,200+'
            }]}
          />
        </Box>
        <CodeHighlighter code={exampleCode} />
      </>
    </SectionBox>
  </div>
);

export default SwiperNumberExample;
