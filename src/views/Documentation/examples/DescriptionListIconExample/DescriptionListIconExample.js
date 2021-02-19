import React from 'react';
import { Box, colors } from '@material-ui/core';
import { Headline, CodeHighlighter, PropsHighlighter, SectionBox } from '../../components';
import { DescriptionListIcon } from 'components/organisms';
import { Icon } from "components/atoms";
import { IconAlternate } from "components/molecules";

const importCodeString = `
import { DescriptionListIcon } from 'components/organisms';
// or
import DescriptionListIcon from 'components/organisms/DescriptionListIcon';
`;

const dataProperties = [{
  name: 'icon',
  type: 'node',
  default: '',
  description: 'Whether should show the alternate icon',
}, {
  name: 'title',
  type: 'string',
  default: '',
  description: 'The title',
}, {
  name: 'align',
  type: 'enum',
  default: 'center',
  description: 'The alignment of the items. One of: left, right, center',
}, {
  name: 'subtitle',
  type: 'string',
  default: '',
  description: 'The subtitle',
}, {
  name: 'subtitleProps',
  type: 'object',
  default: '',
  description: 'Additional props to pass to the subtitle Typography component',
}, {
  name: 'subtitleVariant',
  type: 'string',
  default: 'body1',
  description: 'Subtitle variant',
}, {
  name: 'titleProps',
  type: 'object',
  default: 'body1',
  description: 'Additional props to pass to the title Typography component',
}, {
  name: 'titleVariant',
  type: 'string',
  default: 'h6',
  description: 'Title variant',
}, {
  name: 'className',
  type: 'string',
  default: '',
  description: 'External classes',
}];

const exampleCode1 = `
import React from 'react';
import { Box, colors } from '@material-ui/core';
import { DescriptionListIcon } from 'components/organisms';
import { Icon } from "components/atoms";

export default function Example() {
  return (
    <Box marginBottom={2} padding={2} border="1px solid #ccc" borderRadius="4px">
      <DescriptionListIcon
        title="Coworking communities"
        subtitle="Connect in spaces designed to bring incredible people together. Learn with them and take your project to new heights."
        icon={<Icon fontIconClass="far fa-address-book" size="large" fontIconColor={colors.purple[500]} />}
      />
    </Box>
  );
}
`;

const exampleCode2 = `
import React from 'react';
import { Box, colors } from '@material-ui/core';
import { DescriptionListIcon } from 'components/organisms';
import { IconAlternate } from "components/molecules";

export default function Example() {
  return (
    <Box marginBottom={2} padding={2} border="1px solid #ccc" borderRadius="4px">
      <DescriptionListIcon
        title="Coworking communities"
        subtitle="Connect in spaces designed to bring incredible people together. Learn with them and take your project to new heights."
        icon={<IconAlternate fontIconClass="far fa-address-book" size="medium" color={colors.purple} />}
      />
    </Box>
  );
}
`;

const exampleCode3 = `
import React from 'react';
import { Box, colors } from '@material-ui/core';
import { DescriptionListIcon } from 'components/organisms';
import { IconAlternate } from "components/molecules";

export default function Example() {
  return (
    <Box marginBottom={2} padding={2} border="1px solid #ccc" borderRadius="4px">
      <DescriptionListIcon
        title="Coworking communities"
        subtitle="Connect in spaces designed to bring incredible people together. Learn with them and take your project to new heights."
        icon={<IconAlternate fontIconClass="far fa-address-book" size="medium" color={colors.blue} />}
        align="left"
      />
    </Box>
  );
}
`;

const exampleCode4 = `
import React from 'react';
import { Box, colors } from '@material-ui/core';
import { DescriptionListIcon } from 'components/organisms';
import { IconAlternate } from "components/molecules";

export default function Example() {
  return (
    <Box marginBottom={2} padding={2} border="1px solid #ccc" borderRadius="4px">
      <DescriptionListIcon
        title="Coworking communities"
        subtitle="Connect in spaces designed to bring incredible people together. Learn with them and take your project to new heights."
        icon={<IconAlternate fontIconClass="far fa-address-book" size="medium" color={colors.blue} />}
        align="right"
      />
    </Box>
  );
}
`;

const DescriptionListIconExample = ({ ...rest }) => (
  <div {...rest}>
    <SectionBox title="Description" gutterBottom>
      <Headline
        title="DescriptionListIcon"
        path="src/components/organisms/DescriptionListIcon/DescriptionListIcon.js"
        description="Component to display the description list with icon"
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
          <DescriptionListIcon
            title="Coworking communities"
            subtitle="Connect in spaces designed to bring incredible people together. Learn with them and take your project to new heights."
            icon={<Icon fontIconClass="far fa-address-book" size="large" fontIconColor={colors.purple[500]} />}
          />
        </Box>
        <CodeHighlighter code={exampleCode1} />
      </>
    </SectionBox>
    <SectionBox title="Custom Shadow Example" gutterBottom>
      <>
        <Box marginBottom={2} padding={2} border="1px solid #ccc" borderRadius="4px">
          <DescriptionListIcon
            title="Coworking communities"
            subtitle="Connect in spaces designed to bring incredible people together. Learn with them and take your project to new heights."
            icon={<IconAlternate fontIconClass="far fa-address-book" size="medium" color={colors.purple} />}
          />
        </Box>
        <CodeHighlighter code={exampleCode2} />
      </>
    </SectionBox>
    <SectionBox title="LiftUp Effect Example" gutterBottom>
      <>
        <Box marginBottom={2} padding={2} border="1px solid #ccc" borderRadius="4px">
          <DescriptionListIcon
            title="Coworking communities"
            subtitle="Connect in spaces designed to bring incredible people together. Learn with them and take your project to new heights."
            icon={<IconAlternate fontIconClass="far fa-address-book" size="medium" color={colors.blue} />}
            align="left"
          />
        </Box>
        <CodeHighlighter code={exampleCode3} />
      </>
    </SectionBox>
    <SectionBox title="Basic Card with No Border and No Shadow Example" gutterBottom>
      <>
        <Box marginBottom={2} padding={2} border="1px solid #ccc" borderRadius="4px">
          <DescriptionListIcon
            title="Coworking communities"
            subtitle="Connect in spaces designed to bring incredible people together. Learn with them and take your project to new heights."
            icon={<IconAlternate fontIconClass="far fa-address-book" size="medium" color={colors.blue} />}
            align="right"
          />
        </Box>
        <CodeHighlighter code={exampleCode4} />
      </>
    </SectionBox>
  </div>
);

export default DescriptionListIconExample;
