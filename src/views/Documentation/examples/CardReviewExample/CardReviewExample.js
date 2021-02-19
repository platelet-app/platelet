import React from 'react';
import { Box, colors } from '@material-ui/core';
import { Headline, CodeHighlighter, PropsHighlighter, SectionBox } from '../../components';
import { CardReview } from 'components/organisms';
import { IconAlternate } from "components/molecules";

const importCodeString = `
import { CardReview } from 'components/organisms';
// or
import CardReview from 'components/organisms/CardReview';
`;

const dataProperties = [{
  name: 'authorName',
  type: 'string',
  default: '',
  description: 'Reviewer name to show inside the review card',
}, {
  name: 'authorPhoto',
  type: 'object',
  default: '',
  description: 'Reviewer photo to show inside the review card.Should be an object with src and srcSet properties',
}, {
  name: 'icon',
  type: 'node',
  default: '',
  description: 'Icon to show inside the review card',
}, {
  name: 'text',
  type: 'string',
  default: '',
  description: 'Review text to show inside the review card',
}, {
  name: 'align',
  type: 'enum',
  default: 'center',
  description: 'Alignment of the content. One of: left, right, center',
}, {
  name: 'authorTitle',
  type: 'string',
  default: '',
  description: 'Reviewer title to show inside the review card',
}, {
  name: 'listItemPrimaryTypographyProps',
  type: 'object',
  default: '',
  description: 'Additional props to pass to the list item primary text Typography component',
}, {
  name: 'listItemSecondaryTypographyProps',
  type: 'object',
  default: '',
  description: 'Additional props to pass to the list item secondary text Typography component',
}, {
  name: 'textProps',
  type: 'object',
  default: '',
  description: 'Additional props to pass to the text Typography component',
}, {
  name: 'textVariant',
  type: 'string',
  default: 'h6',
  description: 'Review text variant',
}, {
  name: 'className',
  type: 'string',
  default: '',
  description: 'External classes',
}];

const exampleCode1 = `
import React from 'react';
import { Box, colors } from '@material-ui/core';
import { CardReview } from 'components/organisms';
import { IconAlternate } from "components/molecules";

export default function Example() {
  return (
    <Box marginBottom={2} padding={2} border="1px solid #ccc" borderRadius="4px">
      <CardReview
        icon={<IconAlternate fontIconClass="fas fa-quote-right" size="medium" color={colors.indigo} />}
        text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        authorName="Veronica Adams"
        authorTitle="Growth Marketer, Crealytics"
        authorPhoto={{ src: 'https://assets.maccarianagency.com/the-front/photos/people/veronica-adams.jpg', srcSet: 'https://assets.maccarianagency.com/the-front/photos/people/veronica-adams@2x.jpg 2x' }}
      />
    </Box>
  );
}
`;

const exampleCode2 = `
import React from 'react';
import { Box, colors } from '@material-ui/core';
import { CardReview } from 'components/organisms';
import { IconAlternate } from "components/molecules";

export default function Example() {
  return (
    <Box marginBottom={2} padding={2} border="1px solid #ccc" borderRadius="4px">
      <CardReview
        withShadow
        icon={<IconAlternate fontIconClass="fas fa-quote-right" size="medium" color={colors.indigo} />}
        text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        authorName="Veronica Adams"
        authorTitle="Growth Marketer, Crealytics"
        authorPhoto={{ src: 'https://assets.maccarianagency.com/the-front/photos/people/veronica-adams.jpg', srcSet: 'https://assets.maccarianagency.com/the-front/photos/people/veronica-adams@2x.jpg 2x' }}
      />
    </Box>
  );
}
`;

const exampleCode3 = `
import React from 'react';
import { Box, colors } from '@material-ui/core';
import { CardReview } from 'components/organisms';
import { IconAlternate } from "components/molecules";

export default function Example() {
  return (
    <Box marginBottom={2} padding={2} border="1px solid #ccc" borderRadius="4px">
      <CardReview
        liftUp
        withShadow
        icon={<IconAlternate fontIconClass="fas fa-quote-right" size="medium" color={colors.indigo} />}
        text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        authorName="Veronica Adams"
        authorTitle="Growth Marketer, Crealytics"
        authorPhoto={{ src: 'https://assets.maccarianagency.com/the-front/photos/people/veronica-adams.jpg', srcSet: 'https://assets.maccarianagency.com/the-front/photos/people/veronica-adams@2x.jpg 2x' }}
      />
    </Box>
  );
}
`;

const exampleCode4 = `
import React from 'react';
import { Box, colors } from '@material-ui/core';
import { CardReview } from 'components/organisms';
import { IconAlternate } from "components/molecules";

export default function Example() {
  return (
    <Box marginBottom={2} padding={2} border="1px solid #ccc" borderRadius="4px">
      <CardReview
        noBorder
        noShadow
        icon={<IconAlternate fontIconClass="fas fa-quote-right" size="medium" color={colors.indigo} />}
        text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        authorName="Veronica Adams"
        authorTitle="Growth Marketer, Crealytics"
        authorPhoto={{ src: 'https://assets.maccarianagency.com/the-front/photos/people/veronica-adams.jpg', srcSet: 'https://assets.maccarianagency.com/the-front/photos/people/veronica-adams@2x.jpg 2x' }}
      />
    </Box>
  );
}
`;

const exampleCode5 = `
import React from 'react';
import { Box, colors } from '@material-ui/core';
import { CardReview } from 'components/organisms';
import { IconAlternate } from "components/molecules";

export default function Example() {
  return (
    <Box marginBottom={2} padding={2} border="1px solid #ccc" borderRadius="4px">
      <CardReview
        variant="outlined"
        icon={<IconAlternate fontIconClass="fas fa-quote-right" size="medium" color={colors.indigo} />}
        text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        authorName="Veronica Adams"
        authorTitle="Growth Marketer, Crealytics"
        authorPhoto={{ src: 'https://assets.maccarianagency.com/the-front/photos/people/veronica-adams.jpg', srcSet: 'https://assets.maccarianagency.com/the-front/photos/people/veronica-adams@2x.jpg 2x' }}
      />
    </Box>
  );
}
`;

const CardReviewExample = ({ ...rest }) => (
  <div {...rest}>
    <SectionBox title="Description" gutterBottom>
      <Headline
        title="CardReview"
        path="src/components/organisms/CardReview/CardReview.js"
        description="Component to display the review card"
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
          <CardReview
            icon={<IconAlternate fontIconClass="fas fa-quote-right" size="medium" color={colors.indigo} />}
            text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
            authorName="Veronica Adams"
            authorTitle="Growth Marketer, Crealytics"
            authorPhoto={{ src: 'https://assets.maccarianagency.com/the-front/photos/people/veronica-adams.jpg', srcSet: 'https://assets.maccarianagency.com/the-front/photos/people/veronica-adams@2x.jpg 2x' }}
          />
        </Box>
        <CodeHighlighter code={exampleCode1} />
      </>
    </SectionBox>
    <SectionBox title="Custom Shadow Example" gutterBottom>
      <>
        <Box marginBottom={2} padding={2} border="1px solid #ccc" borderRadius="4px">
          <CardReview
            withShadow
            icon={<IconAlternate fontIconClass="fas fa-quote-right" size="medium" color={colors.indigo} />}
            text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
            authorName="Veronica Adams"
            authorTitle="Growth Marketer, Crealytics"
            authorPhoto={{ src: 'https://assets.maccarianagency.com/the-front/photos/people/veronica-adams.jpg', srcSet: 'https://assets.maccarianagency.com/the-front/photos/people/veronica-adams@2x.jpg 2x' }}
          />
        </Box>
        <CodeHighlighter code={exampleCode2} />
      </>
    </SectionBox>
    <SectionBox title="LiftUp Effect Example" gutterBottom>
      <>
        <Box marginBottom={2} padding={2} border="1px solid #ccc" borderRadius="4px">
          <CardReview
            liftUp
            withShadow
            icon={<IconAlternate fontIconClass="fas fa-quote-right" size="medium" color={colors.indigo} />}
            text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
            authorName="Veronica Adams"
            authorTitle="Growth Marketer, Crealytics"
            authorPhoto={{ src: 'https://assets.maccarianagency.com/the-front/photos/people/veronica-adams.jpg', srcSet: 'https://assets.maccarianagency.com/the-front/photos/people/veronica-adams@2x.jpg 2x' }}
          />
        </Box>
        <CodeHighlighter code={exampleCode3} />
      </>
    </SectionBox>
    <SectionBox title="Basic Card with No Border and No Shadow Example" gutterBottom>
      <>
        <Box marginBottom={2} padding={2} border="1px solid #ccc" borderRadius="4px">
          <CardReview
            noBorder
            noShadow
            icon={<IconAlternate fontIconClass="fas fa-quote-right" size="medium" color={colors.indigo} />}
            text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
            authorName="Veronica Adams"
            authorTitle="Growth Marketer, Crealytics"
            authorPhoto={{ src: 'https://assets.maccarianagency.com/the-front/photos/people/veronica-adams.jpg', srcSet: 'https://assets.maccarianagency.com/the-front/photos/people/veronica-adams@2x.jpg 2x' }}
          />
        </Box>
        <CodeHighlighter code={exampleCode4} />
      </>
    </SectionBox>
    <SectionBox title="Basic Card with Outlined Effect" gutterBottom>
      <>
        <Box marginBottom={2} padding={2} border="1px solid #ccc" borderRadius="4px">
          <CardReview
            variant="outlined"
            icon={<IconAlternate fontIconClass="fas fa-quote-right" size="medium" color={colors.indigo} />}
            text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
            authorName="Veronica Adams"
            authorTitle="Growth Marketer, Crealytics"
            authorPhoto={{ src: 'https://assets.maccarianagency.com/the-front/photos/people/veronica-adams.jpg', srcSet: 'https://assets.maccarianagency.com/the-front/photos/people/veronica-adams@2x.jpg 2x' }}
          />
        </Box>
        <CodeHighlighter code={exampleCode5} />
      </>
    </SectionBox>
  </div>
);

export default CardReviewExample;
