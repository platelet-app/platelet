import React from 'react';
import { Box, colors, Grid } from '@material-ui/core';
import { Headline, CodeHighlighter, PropsHighlighter, SectionBox } from '../../components';
import { CardCategory } from 'components/organisms';
import { IconAlternate } from 'components/molecules';

const importCodeString = `
import { CardCategory } from 'components/organisms';
// or
import CardCategory from 'components/organisms/CardCategory';
`;

const dataProperties = [{
  name: 'icon',
  type: 'node',
  default: '',
  description: 'Icon to show inside the category card',
}, {
  name: 'title',
  type: 'string',
  default: '',
  description: 'Category title to show inside the category card',
}, {
  name: 'align',
  type: 'enum',
  default: '',
  description: 'The content alignment. One of: left, right, center',
}, {
  name: 'className',
  type: 'string',
  default: '',
  description: 'External classes',
}];

const exampleCode1 = `
import React from 'react';
import { Box, colors, Grid } from '@material-ui/core';
import { CardCategory } from 'components/organisms';
import { IconAlternate } from 'components/molecules';

export default function Example() {
  return (
    <Box marginBottom={2} display="flex" justifyContent="space-evenly" alignItems="center" padding={2} border="1px solid #ccc" borderRadius="4px">
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <CardCategory
            title="Web Design"
            icon={<IconAlternate fontIconClass="fas fa-pen-nib" size="medium" color={colors.pink} />}
          />
        </Grid>
        <Grid item xs={4}>
          <CardCategory
            title="Business Analytics"
            icon={<IconAlternate fontIconClass="fas fa-book-open" size="medium" color={colors.purple} />}
          />
        </Grid>
        <Grid item xs={4}>
          <CardCategory
            title="Photography"
            icon={<IconAlternate fontIconClass="fas fa-camera-retro" size="medium" color={colors.blue} />}
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
import { CardCategory } from 'components/organisms';
import { IconAlternate } from 'components/molecules';

export default function Example() {
  return (
    <Box marginBottom={2} display="flex" justifyContent="space-evenly" alignItems="center" padding={2} border="1px solid #ccc" borderRadius="4px">
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <CardCategory
            title="Web Design"
            icon={<IconAlternate fontIconClass="fas fa-pen-nib" size="medium" color={colors.pink} />}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={4}>
          <CardCategory
            title="Business Analytics"
            icon={<IconAlternate fontIconClass="fas fa-book-open" size="medium" color={colors.purple} />}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={4}>
          <CardCategory
            title="Photography"
            icon={<IconAlternate fontIconClass="fas fa-camera-retro" size="medium" color={colors.blue} />}
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
import { CardCategory } from 'components/organisms';
import { IconAlternate } from 'components/molecules';

export default function Example() {
  return (
    <Box marginBottom={2} display="flex" justifyContent="space-evenly" alignItems="center" padding={2} border="1px solid #ccc" borderRadius="4px">
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <CardCategory
            title="Web Design"
            icon={<IconAlternate fontIconClass="fas fa-pen-nib" size="medium" color={colors.pink} />}
            withShadow
            liftUp
          />
        </Grid>
        <Grid item xs={4}>
          <CardCategory
            title="Business Analytics"
            icon={<IconAlternate fontIconClass="fas fa-book-open" size="medium" color={colors.purple} />}
            withShadow
            liftUp
          />
        </Grid>
        <Grid item xs={4}>
          <CardCategory
            title="Photography"
            icon={<IconAlternate fontIconClass="fas fa-camera-retro" size="medium" color={colors.blue} />}
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
import { CardCategory } from 'components/organisms';
import { IconAlternate } from 'components/molecules';

export default function Example() {
  return (
    <Box marginBottom={2} display="flex" justifyContent="space-evenly" alignItems="center" padding={2} border="1px solid #ccc" borderRadius="4px">
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <CardCategory
            title="Web Design"
            icon={<IconAlternate fontIconClass="fas fa-pen-nib" size="medium" color={colors.pink} />}
            withShadow
            liftUp
            align="left"
          />
        </Grid>
        <Grid item xs={4}>
          <CardCategory
            title="Business Analytics"
            icon={<IconAlternate fontIconClass="fas fa-book-open" size="medium" color={colors.purple} />}
            withShadow
            liftUp
            align="left"
          />
        </Grid>
        <Grid item xs={4}>
          <CardCategory
            title="Photography"
            icon={<IconAlternate fontIconClass="fas fa-camera-retro" size="medium" color={colors.blue} />}
            withShadow
            liftUp
            align="left"
          />
        </Grid>
      </Grid>
    </Box>
  );
}
`;

const CardCategoryExample = ({ ...rest }) => (
  <div {...rest}>
    <SectionBox title="Description" gutterBottom>
      <Headline
        title="CardCategory"
        path="src/components/organisms/CardCategory/CardCategory.js"
        description="Component to display the category card"
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
                <CardCategory
                  title="Web Design"
                  icon={<IconAlternate fontIconClass="fas fa-pen-nib" size="medium" color={colors.pink} />}
                />
              </Grid>
              <Grid item xs={4}>
                <CardCategory
                  title="Business Analytics"
                  icon={<IconAlternate fontIconClass="fas fa-book-open" size="medium" color={colors.purple} />}
                />
              </Grid>
              <Grid item xs={4}>
                <CardCategory
                  title="Photography"
                  icon={<IconAlternate fontIconClass="fas fa-camera-retro" size="medium" color={colors.blue} />}
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
                <CardCategory
                  title="Web Design"
                  icon={<IconAlternate fontIconClass="fas fa-pen-nib" size="medium" color={colors.pink} />}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={4}>
                <CardCategory
                  title="Business Analytics"
                  icon={<IconAlternate fontIconClass="fas fa-book-open" size="medium" color={colors.purple} />}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={4}>
                <CardCategory
                  title="Photography"
                  icon={<IconAlternate fontIconClass="fas fa-camera-retro" size="medium" color={colors.blue} />}
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
                <CardCategory
                  title="Web Design"
                  icon={<IconAlternate fontIconClass="fas fa-pen-nib" size="medium" color={colors.pink} />}
                  withShadow
                  liftUp
                />
              </Grid>
              <Grid item xs={4}>
                <CardCategory
                  title="Business Analytics"
                  icon={<IconAlternate fontIconClass="fas fa-book-open" size="medium" color={colors.purple} />}
                  withShadow
                  liftUp
                />
              </Grid>
              <Grid item xs={4}>
                <CardCategory
                  title="Photography"
                  icon={<IconAlternate fontIconClass="fas fa-camera-retro" size="medium" color={colors.blue} />}
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
                <CardCategory
                  title="Web Design"
                  icon={<IconAlternate fontIconClass="fas fa-pen-nib" size="medium" color={colors.pink} />}
                  withShadow
                  liftUp
                  align="left"
                />
              </Grid>
              <Grid item xs={4}>
                <CardCategory
                  title="Business Analytics"
                  icon={<IconAlternate fontIconClass="fas fa-book-open" size="medium" color={colors.purple} />}
                  withShadow
                  liftUp
                  align="left"
                />
              </Grid>
              <Grid item xs={4}>
                <CardCategory
                  title="Photography"
                  icon={<IconAlternate fontIconClass="fas fa-camera-retro" size="medium" color={colors.blue} />}
                  withShadow
                  liftUp
                  align="left"
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

export default CardCategoryExample;
