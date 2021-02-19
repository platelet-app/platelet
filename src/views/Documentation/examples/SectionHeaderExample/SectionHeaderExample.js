import React from 'react';
import { Box, Typography, Button } from '@material-ui/core';
import { Headline, CodeHighlighter, PropsHighlighter, SectionBox } from '../../components';
import { Image } from 'components/atoms';
import { SectionHeader } from 'components/molecules';

const importCodeString = `
import { SectionHeader } from 'components/molecules';
// or
import SectionHeader from 'components/molecules/SectionHeader';
`;

const dataProperties = [{
  name: 'title',
  type: 'union',
  default: '',
  description: 'Title of the section header. One of type: string, node',
}, {
  name: 'align',
  type: 'enum',
  default: '',
  description: 'Header content (title, subtitle, CTAs) alignment. One of: right, left, center',
}, {
  name: 'className',
  type: 'string',
  default: '',
  description: 'External classes',
}, {
  name: 'ctaGroup',
  type: 'node[]',
  default: '',
  description: 'Array of the CTAs',
}, {
  name: 'disableGutter',
  type: 'bool',
  default: '',
  description: 'Whether to disable bottom margin of the section',
}, {
  name: 'fadeUp',
  type: 'bool',
  default: '',
  description: 'Whether to fade up on scroll',
}, {
  name: 'label',
  type: 'string',
  default: '',
  description: 'Label title of the section header',
}, {
  name: 'labelProps',
  type: 'object',
  default: '',
  description: 'Additional properties to pass to the label Typography component',
}, {
  name: 'overline',
  type: 'node',
  default: '',
  description: 'The overline component in the section header',
}, {
  name: 'subtitle',
  type: 'union',
  default: '',
  description: 'Subtitle of the section header. One of type: string, node',
}, {
  name: 'subtitleColor',
  type: 'enum',
  default: '',
  description: 'SubTitle color. One of: textPrimary, textSecondary, primary, secondary',
}, {
  name: 'subtitleProps',
  type: 'object',
  default: '',
  description: 'Additional properties to pass to the subtitle Typography component',
}, {
  name: 'subtitleVariant',
  type: 'enum',
  default: '',
  description: 'SubTitle variant. One of: h1, h2, h3, h4, h5, h6, subtitle1, subtitle2, body1, body2',
}, {
  name: 'titleClasses',
  type: 'string',
  default: '',
  description: 'Styles classes to be attached to the title from the parent component',
}, {
  name: 'titleProps',
  type: 'object',
  default: '',
  description: 'Additional properties to pass to the title Typography component',
}, {
  name: 'titleVariant',
  type: 'enum',
  default: 'h4',
  description: 'Title variant. One of: h1, h2, h3, h4, h5, h6',
}];

const exampleCode1 = `
import React from 'react';
import { Box } from '@material-ui/core';
import { SectionHeader } from 'components/molecules';

export default function Example() {
  return (
    <Box marginBottom={2} display="flex" justifyContent="space-evenly" alignItems="center" padding={2} border="1px solid #ccc" borderRadius="4px">
      <SectionHeader
        title="We are reimagining renting to help you achieve your dreams"
        subtitle="Our mission is to help you grow your business, meet and connect with people who share your passions. We help you fulfill your best potential through an engaging lifestyle experience."
      />
    </Box>
  );
}
`;

const exampleCode2 = `
import React from 'react';
import { Box, Typography } from '@material-ui/core';
import { SectionHeader } from 'components/molecules';

export default function Example() {
  return (
    <Box marginBottom={2} display="flex" justifyContent="space-evenly" alignItems="center" padding={2} border="1px solid #ccc" borderRadius="4px">
      <SectionHeader
        title={<span>We are reimagining renting to help you <Typography color="secondary" variant="inherit" component="span">achieve your dreams</Typography></span>}
        subtitle="Our mission is to help you grow your business, meet and connect with people who share your passions. We help you fulfill your best potential through an engaging lifestyle experience."
      />
    </Box>
  );
}
`;

const exampleCode3 = `
import React from 'react';
import { Box } from '@material-ui/core';
import { SectionHeader } from 'components/molecules';

export default function Example() {
  return (
    <Box marginBottom={2} display="flex" justifyContent="space-evenly" alignItems="center" padding={2} border="1px solid #ccc" borderRadius="4px">
      <SectionHeader
        title="We are reimagining renting to help you achieve your dreams"
        subtitle="Our mission is to help you grow your business, meet and connect with people who share your passions. We help you fulfill your best potential through an engaging lifestyle experience."
        align="left"
        fadeUp
      />
    </Box>
  );
}
`;

const exampleCode4 = `
import React from 'react';
import { Box } from '@material-ui/core';
import { SectionHeader } from 'components/molecules';

export default function Example() {
  return (
    <Box marginBottom={2} display="flex" justifyContent="space-evenly" alignItems="center" padding={2} border="1px solid #ccc" borderRadius="4px">
      <SectionHeader
        title="We are reimagining renting to help you achieve your dreams"
      />
    </Box>
  );
}
`;

const exampleCode5 = `
import React from 'react';
import { Box, Button } from '@material-ui/core';
import { SectionHeader } from 'components/molecules';

export default function Example() {
  return (
    <Box marginBottom={2} display="flex" justifyContent="space-evenly" alignItems="center" padding={2} border="1px solid #ccc" borderRadius="4px">
      <SectionHeader
        title="We are reimagining renting to help you achieve your dreams"
        subtitle="Our mission is to help you grow your business, meet and connect with people who share your passions. We help you fulfill your best potential through an engaging lifestyle experience."
        ctaGroup={[(
            <Button color="primary" variant="contained">Submit</Button>
        ), (
            <Button color="primary" variant="outlined">Learn More</Button>
        )]}
      />
    </Box>
  );
}
`;

const exampleCode6 = `
import React from 'react';
import { Box } from '@material-ui/core';
import { SectionHeader } from 'components/molecules';

export default function Example() {
  return (
    <Box marginBottom={2} display="flex" justifyContent="space-evenly" alignItems="center" padding={2} border="1px solid #ccc" borderRadius="4px">
      <SectionHeader
        title={<>Find a job you love.<a href="https://thefront.maccarianagency.com/"> Learn more</a></>}
        subtitle={<>Try it now.<a href="https://thefront.maccarianagency.com/"> Learn more</a></>}
        ctaGroup={[(
            <Button color="primary" variant="contained">Submit</Button>
        ), (
            <Button color="primary" variant="outlined">Learn More</Button>
        )]}
      />
    </Box>
  );
}
`;

const exampleCode7 = `
import React from 'react';
import { Box } from '@material-ui/core';
import { SectionHeader } from 'components/molecules';

export default function Example() {
  return (
    <Box marginBottom={2} display="flex" justifyContent="space-evenly" alignItems="center" padding={2} border="1px solid #ccc" borderRadius="4px">
      <SectionHeader
        label="our process"
        title={<>Find a job you love.<a href="https://thefront.maccarianagency.com/"> Learn more</a></>}
        subtitle={<>Try it now.<a href="https://thefront.maccarianagency.com/"> Learn more</a></>}
        ctaGroup={[(
            <Button color="primary" variant="contained">Submit</Button>
        ), (
            <Button color="primary" variant="outlined">Learn More</Button>
        )]}
      />
    </Box>
  );
}
`;

const exampleCode8 = `
import React from 'react';
import { Box } from '@material-ui/core';
import { Image } from 'components/atoms';
import { SectionHeader } from 'components/molecules';

export default function Example() {
  return (
    <Box marginBottom={2} display="flex" justifyContent="space-evenly" alignItems="center" padding={2} border="1px solid #ccc" borderRadius="4px">
      <SectionHeader
        overline={<Image src="https://assets.maccarianagency.com/the-front/illustrations/rated-by-our-customer.png" alt="rating" style={{ width: 120, height: 'auto' }} width="auto" />}
        title="Rated 5 out of 5 stars by our customers!"
        subtitle="Companies from across the globe have had fantastic experiences using TheFront. Here’s what they have to say."
        ctaGroup={[(
            <Button color="primary" variant="contained">Submit</Button>
        ), (
            <Button color="primary" variant="outlined">Learn More</Button>
        )]}
      />
    </Box>
  );
}
`;

const SectionHeaderExample = ({ ...rest }) => (
  <div {...rest}>
    <SectionBox title="Description" gutterBottom>
      <Headline
        title="SectionHeader"
        path="src/components/molecules/SectionHeader/SectionHeader.js"
        description="Component to display the section headers"
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
          <SectionHeader
            title="We are reimagining renting to help you achieve your dreams"
            subtitle="Our mission is to help you grow your business, meet and connect with people who share your passions. We help you fulfill your best potential through an engaging lifestyle experience."
          />
        </Box>
        <CodeHighlighter code={exampleCode1} />
      </>
    </SectionBox>
    <SectionBox title="Example With Highlighted Title" gutterBottom>
      <>
        <Box marginBottom={2} display="flex" justifyContent="space-evenly" alignItems="center" padding={2} border="1px solid #ccc" borderRadius="4px">
          <SectionHeader
            title={<span>We are reimagining renting to help you <Typography color="secondary" variant="inherit" component="span">achieve your dreams</Typography></span>}
            subtitle="Our mission is to help you grow your business, meet and connect with people who share your passions. We help you fulfill your best potential through an engaging lifestyle experience."
          />
        </Box>
        <CodeHighlighter code={exampleCode2} />
      </>
    </SectionBox>
    <SectionBox title="Aligned Left and with FadeUp" gutterBottom>
      <>
        <Box marginBottom={2} display="flex" justifyContent="space-evenly" alignItems="center" padding={2} border="1px solid #ccc" borderRadius="4px">
          <SectionHeader
            title="We are reimagining renting to help you achieve your dreams"
            subtitle="Our mission is to help you grow your business, meet and connect with people who share your passions. We help you fulfill your best potential through an engaging lifestyle experience."
            align="left"
            fadeUp
          />
        </Box>
        <CodeHighlighter code={exampleCode3} />
      </>
    </SectionBox>
    <SectionBox title="Title only" gutterBottom>
      <>
        <Box marginBottom={2} display="flex" justifyContent="space-evenly" alignItems="center" padding={2} border="1px solid #ccc" borderRadius="4px">
          <SectionHeader
            title="We are reimagining renting to help you achieve your dreams"
          />
        </Box>
        <CodeHighlighter code={exampleCode4} />
      </>
    </SectionBox>
    <SectionBox title="With Call to action buttons" gutterBottom>
      <>
        <Box marginBottom={2} display="flex" justifyContent="space-evenly" alignItems="center" padding={2} border="1px solid #ccc" borderRadius="4px">
          <SectionHeader
            title="We are reimagining renting to help you achieve your dreams"
            subtitle="Our mission is to help you grow your business, meet and connect with people who share your passions. We help you fulfill your best potential through an engaging lifestyle experience."
            ctaGroup={[(
                <Button color="primary" variant="contained">Submit</Button>
            ), (
                <Button color="primary" variant="outlined">Learn More</Button>
            )]}
          />
        </Box>
        <CodeHighlighter code={exampleCode5} />
      </>
    </SectionBox>
    <SectionBox title="With HTML injected title and subtitle" gutterBottom>
      <>
        <Box marginBottom={2} display="flex" justifyContent="space-evenly" alignItems="center" padding={2} border="1px solid #ccc" borderRadius="4px">
          <SectionHeader
            title={<>Find a job you love.<a href="https://thefront.maccarianagency.com/"> Learn more</a></>}
            subtitle={<>Try it now.<a href="https://thefront.maccarianagency.com/"> Learn more</a></>}
            ctaGroup={[(
                <Button color="primary" variant="contained">Submit</Button>
            ), (
                <Button color="primary" variant="outlined">Learn More</Button>
            )]}
          />
        </Box>
        <CodeHighlighter code={exampleCode6} />
      </>
    </SectionBox>
    <SectionBox title="With label" gutterBottom>
      <>
        <Box marginBottom={2} display="flex" justifyContent="space-evenly" alignItems="center" padding={2} border="1px solid #ccc" borderRadius="4px">
          <SectionHeader
            label="our process"
            title={<>Find a job you love.<a href="https://thefront.maccarianagency.com/"> Learn more</a></>}
            subtitle={<>Try it now.<a href="https://thefront.maccarianagency.com/"> Learn more</a></>}
            ctaGroup={[(
                <Button color="primary" variant="contained">Submit</Button>
            ), (
                <Button color="primary" variant="outlined">Learn More</Button>
            )]}
          />
        </Box>
        <CodeHighlighter code={exampleCode7} />
      </>
    </SectionBox>
    <SectionBox title="With Overline" gutterBottom>
      <>
        <Box marginBottom={2} display="flex" justifyContent="space-evenly" alignItems="center" padding={2} border="1px solid #ccc" borderRadius="4px">
          <SectionHeader
            overline={<Image src="https://assets.maccarianagency.com/the-front/illustrations/rated-by-our-customer.png" alt="rating" style={{ width: 120, height: 'auto' }} width="auto" />}
            title="Rated 5 out of 5 stars by our customers!"
            subtitle="Companies from across the globe have had fantastic experiences using TheFront. Here’s what they have to say."
            ctaGroup={[(
                <Button color="primary" variant="contained">Submit</Button>
            ), (
                <Button color="primary" variant="outlined">Learn More</Button>
            )]}
          />
        </Box>
        <CodeHighlighter code={exampleCode8} />
      </>
    </SectionBox>
  </div>
);

export default SectionHeaderExample;
