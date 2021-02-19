import React from 'react';
import { Box, Grid, colors } from '@material-ui/core';
import { Headline, CodeHighlighter, PropsHighlighter, SectionBox } from '../../components';
import { CardJobTag } from 'components/organisms';

const importCodeString = `
import { CardJobTag } from 'components/organisms';
// or
import CardJobTag from 'components/organisms/CardJobTag';
`;

const dataProperties = [{
  name: 'badgeColor',
  type: 'string',
  default: '',
  description: 'Badge color of the job card',
}, {
  name: 'badgeTitle',
  type: 'string',
  default: '',
  description: 'Badge title of the job card',
}, {
  name: 'jobLocation',
  type: 'string',
  default: '',
  description: 'Job location of the card',
}, {
  name: 'jobTitle',
  type: 'string',
  default: '',
  description: 'Job title of the card',
}, {
  name: 'jobType',
  type: 'string',
  default: '',
  description: 'Job type of the card',
}, {
  name: 'className',
  type: 'string',
  default: '',
  description: 'External classes',
}];

const exampleCode1 = `
import React from 'react';
import { Box, Grid, colors } from '@material-ui/core';
import { CardJobTag } from 'components/organisms';

export default function Example() {
  return (
    <Box marginBottom={2} padding={2} border="1px solid #ccc" borderRadius="4px">
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <CardJobTag
            jobTitle="Senior Developer"
            badgeColor={colors.red[500]}
            badgeTitle="tech"
            jobLocation="Milan, Italy"
            jobType="Full Time"
            jobDate="2 days ago"
            companyName="Slack"
            companyLogo="https://assets.maccarianagency.com/the-front/logos/slack.svg"
          />
        </Grid>
        <Grid item xs={4}>
          <CardJobTag
            jobTitle="Web designer internship"
            badgeColor={colors.blue[500]}
            badgeTitle="web design"
            jobLocation="Milan, Italy"
            jobType="Full Time"
            jobDate="2 days ago"
            companyName="Slack"
            companyLogo="https://assets.maccarianagency.com/the-front/logos/slack.svg"
          />
        </Grid>
        <Grid item xs={4}>
          <CardJobTag
            jobTitle="UI/UX Designer"
            badgeColor={colors.green[500]}
            badgeTitle="web design"
            jobLocation="Milan, Italy"
            jobType="Full Time"
            jobDate="2 days ago"
            companyName="Slack"
            companyLogo="https://assets.maccarianagency.com/the-front/logos/slack.svg"
          />
        </Grid>
      </Grid>
    </Box>
  );
}
`;

const exampleCode2 = `
import React from 'react';
import { Box, Grid, colors } from '@material-ui/core';
import { CardJobTag } from 'components/organisms';

export default function Example() {
  return (
    <Box marginBottom={2} padding={2} border="1px solid #ccc" borderRadius="4px">
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <CardJobTag
            jobTitle="Senior Developer"
            badgeColor={colors.red[500]}
            badgeTitle="tech"
            jobLocation="Milan, Italy"
            jobType="Full Time"
            jobDate="2 days ago"
            companyName="Slack"
            companyLogo="https://assets.maccarianagency.com/the-front/logos/slack.svg"
            variant="outlined"
          />
        </Grid>
        <Grid item xs={4}>
          <CardJobTag
            jobTitle="Web designer internship"
            badgeColor={colors.blue[500]}
            badgeTitle="web design"
            jobLocation="Milan, Italy"
            jobType="Full Time"
            jobDate="2 days ago"
            companyName="Slack"
            companyLogo="https://assets.maccarianagency.com/the-front/logos/slack.svg"
            variant="outlined"
          />
        </Grid>
        <Grid item xs={4}>
          <CardJobTag
            jobTitle="UI/UX Designer"
            badgeColor={colors.green[500]}
            badgeTitle="web design"
            jobLocation="Milan, Italy"
            jobType="Full Time"
            jobDate="2 days ago"
            companyName="Slack"
            companyLogo="https://assets.maccarianagency.com/the-front/logos/slack.svg"
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
import { Box, Grid, colors } from '@material-ui/core';
import { CardJobTag } from 'components/organisms';

export default function Example() {
  return (
    <Box marginBottom={2} padding={2} border="1px solid #ccc" borderRadius="4px">
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <CardJobTag
            jobTitle="Senior Developer"
            badgeColor={colors.red[500]}
            badgeTitle="tech"
            jobLocation="Milan, Italy"
            jobType="Full Time"
            jobDate="2 days ago"
            companyName="Slack"
            companyLogo="https://assets.maccarianagency.com/the-front/logos/slack.svg"
            withShadow
            liftUp
          />
        </Grid>
        <Grid item xs={4}>
          <CardJobTag
            jobTitle="Web designer internship"
            badgeColor={colors.blue[500]}
            badgeTitle="web design"
            jobLocation="Milan, Italy"
            jobType="Full Time"
            jobDate="2 days ago"
            companyName="Slack"
            companyLogo="https://assets.maccarianagency.com/the-front/logos/slack.svg"
            withShadow
            liftUp
          />
        </Grid>
        <Grid item xs={4}>
          <CardJobTag
            jobTitle="UI/UX Designer"
            badgeColor={colors.green[500]}
            badgeTitle="web design"
            jobLocation="Milan, Italy"
            jobType="Full Time"
            jobDate="2 days ago"
            companyName="Slack"
            companyLogo="https://assets.maccarianagency.com/the-front/logos/slack.svg"
            withShadow
            liftUp
          />
        </Grid>
      </Grid>
    </Box>
  );
}
`;

const CardJobTagExample = ({ ...rest }) => (
  <div {...rest}>
    <SectionBox title="Description" gutterBottom>
      <Headline
        title="CardJobTag"
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
        <Box marginBottom={2} padding={2} border="1px solid #ccc" borderRadius="4px" overflow="auto">
          <Box display="flex" justifyContent="space-around" alignItems="center" minWidth="900px">
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <CardJobTag
                  jobTitle="Senior Developer"
                  badgeColor={colors.red[500]}
                  badgeTitle="tech"
                  jobLocation="Milan, Italy"
                  jobType="Full Time"
                />
              </Grid>
              <Grid item xs={4}>
                <CardJobTag
                  jobTitle="Web designer internship"
                  badgeColor={colors.blue[500]}
                  badgeTitle="web design"
                  jobLocation="Milan, Italy"
                  jobType="Full Time"
                />
              </Grid>
              <Grid item xs={4}>
                <CardJobTag
                  jobTitle="UI/UX Designer"
                  badgeColor={colors.green[500]}
                  badgeTitle="web design"
                  jobLocation="Milan, Italy"
                  jobType="Full Time"
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
          <Box display="flex" justifyContent="space-around" alignItems="center" minWidth="900px">
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <CardJobTag
                  jobTitle="Senior Developer"
                  badgeColor={colors.red[500]}
                  badgeTitle="tech"
                  jobLocation="Milan, Italy"
                  jobType="Full Time"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={4}>
                <CardJobTag
                  jobTitle="Web designer internship"
                  badgeColor={colors.blue[500]}
                  badgeTitle="web design"
                  jobLocation="Milan, Italy"
                  jobType="Full Time"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={4}>
                <CardJobTag
                  jobTitle="UI/UX Designer"
                  badgeColor={colors.green[500]}
                  badgeTitle="web design"
                  jobLocation="Milan, Italy"
                  jobType="Full Time"
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
          <Box display="flex" justifyContent="space-around" alignItems="center" minWidth="900px">
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <CardJobTag
                  jobTitle="Senior Developer"
                  badgeColor={colors.red[500]}
                  badgeTitle="tech"
                  jobLocation="Milan, Italy"
                  jobType="Full Time"
                  withShadow
                  liftUp
                />
              </Grid>
              <Grid item xs={4}>
                <CardJobTag
                  jobTitle="Web designer internship"
                  badgeColor={colors.blue[500]}
                  badgeTitle="web design"
                  jobLocation="Milan, Italy"
                  jobType="Full Time"
                  withShadow
                  liftUp
                />
              </Grid>
              <Grid item xs={4}>
                <CardJobTag
                  jobTitle="UI/UX Designer"
                  badgeColor={colors.green[500]}
                  badgeTitle="web design"
                  jobLocation="Milan, Italy"
                  jobType="Full Time"
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
  </div>
);

export default CardJobTagExample;
