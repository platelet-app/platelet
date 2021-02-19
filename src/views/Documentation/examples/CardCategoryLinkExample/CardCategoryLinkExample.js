import React from 'react';
import { Box, colors, Grid } from '@material-ui/core';
import { Headline, CodeHighlighter, PropsHighlighter, SectionBox } from '../../components';
import { CardCategoryLink } from 'components/organisms';

const importCodeString = `
import { CardCategoryLink } from 'components/organisms';
// or
import CardCategoryLink from 'components/organisms/CardCategoryLink';
`;

const dataProperties = [{
  name: 'color',
  type: 'enum',
  default: '',
  description: 'Promo icon color to show inside the card. One of: colors.red, colors.pink, colors.purple, colors.deepPurple, colors.indigo, colors.blue, colors.lightBlue, colors.cyan, colors.teal, colors.green, colors.lightGreen, colors.lime, colors.yellow, colors.amber, colors.orange, colors.deepOrange, colors.brown, colors.grey, colors.blueGrey',
}, {
  name: 'title',
  type: 'string',
  default: '',
  description: 'Promo title to show inside the card',
}, {
  name: 'align',
  type: 'enum',
  default: 'left',
  description: 'The content alignment. One of: left, right, center',
}, {
  name: 'className',
  type: 'string',
  default: '',
  description: 'External classes',
}, {
  name: 'fontIconClass',
  type: 'string',
  default: '',
  description: 'Promo font icon class name to show inside the card',
}, {
  name: 'href',
  type: 'string',
  default: '#',
  description: 'Promo description to show inside the card',
}, {
  name: 'iconAlternateProps',
  type: 'object',
  default: '',
  description: 'Additional props to pass to the IconAlternate component',
}, {
  name: 'subtitle',
  type: 'string',
  default: '',
  description: 'Promo subtitle to show inside the card',
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
}];

const exampleCode1 = `
import React from 'react';
import { Box, colors, Grid } from '@material-ui/core';
import { CardCategoryLink } from 'components/organisms';

export default function Example() {
  return (
    <Box marginBottom={2} display="flex" justifyContent="space-evenly" alignItems="center" padding={2} border="1px solid #ccc" borderRadius="4px">
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <CardCategoryLink
            title="Web Design"
            subtitle="Choose from over 1000+ online video courses."
            fontIconClass="fas fa-pen-nib"
            color={colors.pink}
          />
        </Grid>
        <Grid item xs={4}>
          <CardCategoryLink
            title="Business Analytics"
            subtitle="Choose from over 1000+ online video courses."
            fontIconClass="fas fa-book-open"
            color={colors.purple}
          />
        </Grid>
        <Grid item xs={4}>
          <CardCategoryLink
            title="Photography"
            subtitle="Choose from over 1000+ online video courses."
            fontIconClass="fas fa-camera-retro"
            color={colors.blue}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
`;

const exampleCode2 = `
import React from 'react';
import { Box, colors, Grid } from '@material-ui/core';
import { CardCategoryLink } from 'components/organisms';

export default function Example() {
  return (
    <Box marginBottom={2} display="flex" justifyContent="space-evenly" alignItems="center" padding={2} border="1px solid #ccc" borderRadius="4px">
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <CardCategoryLink
            title="Web Design"
            subtitle="Choose from over 1000+ online video courses."
            fontIconClass="fas fa-pen-nib"
            color={colors.pink}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={4}>
          <CardCategoryLink
            title="Business Analytics"
            subtitle="Choose from over 1000+ online video courses."
            fontIconClass="fas fa-book-open"
            color={colors.purple}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={4}>
          <CardCategoryLink
            title="Photography"
            subtitle="Choose from over 1000+ online video courses."
            fontIconClass="fas fa-camera-retro"
            color={colors.blue}
            variant="outlined"
          />
        </Grid>
      </Grid>
    </Box>
  );
}
`;

const exampleCode3 = `
import React from 'react';
import { Box, colors, Grid } from '@material-ui/core';
import { CardCategoryLink } from 'components/organisms';

export default function Example() {
  return (
    <Box marginBottom={2} display="flex" justifyContent="space-evenly" alignItems="center" padding={2} border="1px solid #ccc" borderRadius="4px">
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <CardCategoryLink
            title="Web Design"
            subtitle="Choose from over 1000+ online video courses."
            fontIconClass="fas fa-pen-nib"
            color={colors.pink}
            withShadow
            liftUp
          />
        </Grid>
        <Grid item xs={4}>
          <CardCategoryLink
            title="Business Analytics"
            subtitle="Choose from over 1000+ online video courses."
            fontIconClass="fas fa-book-open"
            color={colors.purple}
            withShadow
            liftUp
          />
        </Grid>
        <Grid item xs={4}>
          <CardCategoryLink
            title="Photography"
            subtitle="Choose from over 1000+ online video courses."
            fontIconClass="fas fa-camera-retro"
            color={colors.blue}
            withShadow
            liftUp
          />
        </Grid>
      </Grid>
    </Box>
  );
}
`;

const exampleCode4 = `
import React from 'react';
import { Box, colors, Grid } from '@material-ui/core';
import { CardCategoryLink } from 'components/organisms';

export default function Example() {
  return (
    <Box marginBottom={2} display="flex" justifyContent="space-evenly" alignItems="center" padding={2} border="1px solid #ccc" borderRadius="4px">
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <CardCategoryLink
            title="Web Design"
            subtitle="Choose from over 1000+ online video courses."
            fontIconClass="fas fa-pen-nib"
            color={colors.pink}
            withShadow
            liftUp
            align="center"
          />
        </Grid>
        <Grid item xs={4}>
          <CardCategoryLink
            title="Business Analytics"
            subtitle="Choose from over 1000+ online video courses."
            fontIconClass="fas fa-book-open"
            color={colors.purple}
            withShadow
            liftUp
            align="center"
          />
        </Grid>
        <Grid item xs={4}>
          <CardCategoryLink
            title="Photography"
            subtitle="Choose from over 1000+ online video courses."
            fontIconClass="fas fa-camera-retro"
            color={colors.blue}
            withShadow
            liftUp
            align="center"
          />
        </Grid>
      </Grid>
    </Box>
  );
}
`;

const CardCategoryLinkExample = ({ ...rest }) => (
  <div {...rest}>
    <SectionBox title="Description" gutterBottom>
      <Headline
        title="CardCategoryLink"
        path="src/components/organisms/CardCategoryLink/CardCategoryLink.js"
        description="Component to display the category link card"
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
        <Box marginBottom={2} padding={2} border="1px solid #ccc" borderRadius="4px" overflow="auto">
          <Box display="flex" justifyContent="space-around" alignItems="center" minWidth="700px">
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <CardCategoryLink
                  title="Web Design"
                  subtitle="Choose from over 1000+ online video courses."
                  fontIconClass="fas fa-pen-nib"
                  color={colors.pink}
                />
              </Grid>
              <Grid item xs={4}>
                <CardCategoryLink
                  title="Business Analytics"
                  subtitle="Choose from over 1000+ online video courses."
                  fontIconClass="fas fa-book-open"
                  color={colors.purple}
                />
              </Grid>
              <Grid item xs={4}>
                <CardCategoryLink
                  title="Photography"
                  subtitle="Choose from over 1000+ online video courses."
                  fontIconClass="fas fa-camera-retro"
                  color={colors.blue}
                />
              </Grid>
            </Grid>
          </Box>
        </Box>
        <CodeHighlighter code={exampleCode1} />
      </>
    </SectionBox>
    <SectionBox title="Outlined" gutterBottom>
      <>
        <Box marginBottom={2} padding={2} border="1px solid #ccc" borderRadius="4px" overflow="auto">
          <Box display="flex" justifyContent="space-around" alignItems="center" minWidth="700px">
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <CardCategoryLink
                  title="Web Design"
                  subtitle="Choose from over 1000+ online video courses."
                  fontIconClass="fas fa-pen-nib"
                  color={colors.pink}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={4}>
                <CardCategoryLink
                  title="Business Analytics"
                  subtitle="Choose from over 1000+ online video courses."
                  fontIconClass="fas fa-book-open"
                  color={colors.purple}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={4}>
                <CardCategoryLink
                  title="Photography"
                  subtitle="Choose from over 1000+ online video courses."
                  fontIconClass="fas fa-camera-retro"
                  color={colors.blue}
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </Box>
        </Box>
        <CodeHighlighter code={exampleCode2} />
      </>
    </SectionBox>
    <SectionBox title="Custom Shadow and LiftUp Effect" gutterBottom>
      <>
        <Box marginBottom={2} padding={2} border="1px solid #ccc" borderRadius="4px" overflow="auto">
          <Box display="flex" justifyContent="space-around" alignItems="center" minWidth="700px">
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <CardCategoryLink
                  title="Web Design"
                  subtitle="Choose from over 1000+ online video courses."
                  fontIconClass="fas fa-pen-nib"
                  color={colors.pink}
                  withShadow
                  liftUp
                />
              </Grid>
              <Grid item xs={4}>
                <CardCategoryLink
                  title="Business Analytics"
                  subtitle="Choose from over 1000+ online video courses."
                  fontIconClass="fas fa-book-open"
                  color={colors.purple}
                  withShadow
                  liftUp
                />
              </Grid>
              <Grid item xs={4}>
                <CardCategoryLink
                  title="Photography"
                  subtitle="Choose from over 1000+ online video courses."
                  fontIconClass="fas fa-camera-retro"
                  color={colors.blue}
                  withShadow
                  liftUp
                />
              </Grid>
            </Grid>
          </Box>
        </Box>
        <CodeHighlighter code={exampleCode3} />
      </>
    </SectionBox>
    <SectionBox title="Left Aligned" gutterBottom>
      <>
        <Box marginBottom={2} padding={2} border="1px solid #ccc" borderRadius="4px" overflow="auto">
          <Box display="flex" justifyContent="space-around" alignItems="center" minWidth="700px">
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <CardCategoryLink
                  title="Web Design"
                  subtitle="Choose from over 1000+ online video courses."
                  fontIconClass="fas fa-pen-nib"
                  color={colors.pink}
                  withShadow
                  liftUp
                  align="center"
                />
              </Grid>
              <Grid item xs={4}>
                <CardCategoryLink
                  title="Business Analytics"
                  subtitle="Choose from over 1000+ online video courses."
                  fontIconClass="fas fa-book-open"
                  color={colors.purple}
                  withShadow
                  liftUp
                  align="center"
                />
              </Grid>
              <Grid item xs={4}>
                <CardCategoryLink
                  title="Photography"
                  subtitle="Choose from over 1000+ online video courses."
                  fontIconClass="fas fa-camera-retro"
                  color={colors.blue}
                  withShadow
                  liftUp
                  align="center"
                />
              </Grid>
            </Grid>
          </Box>
        </Box>
        <CodeHighlighter code={exampleCode4} />
      </>
    </SectionBox>
  </div>
);

export default CardCategoryLinkExample;
