import React from 'react';
import { Box, Grid } from '@material-ui/core';
import { Headline, CodeHighlighter, PropsHighlighter, SectionBox } from '../../components';
import { CardJobCompany } from 'components/organisms';

const importCodeString = `
import { CardJobCompany } from 'components/organisms';
// or
import CardJobCompany from 'components/organisms/CardJobCompany';
`;

const dataProperties = [{
  name: 'companyInfo',
  type: 'string',
  default: '',
  description: 'Company info in the card',
}, {
  name: 'companyLogo',
  type: 'string',
  default: '',
  description: 'Company logo of the card',
}, {
  name: 'companyName',
  type: 'string',
  default: '',
  description: 'Company name of the card',
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
  name: 'jobsCount',
  type: 'string',
  default: '',
  description: 'Count of the jobs in the the card',
}, {
  name: 'className',
  type: 'string',
  default: '',
  description: 'External classes',
}];

const exampleCode1 = `
import React from 'react';
import { Box, Grid } from '@material-ui/core';
import { CardJobCompany } from 'components/organisms';

export default function Example() {
  return (
    <Box marginBottom={2} display="flex" justifyContent="space-evenly" alignItems="center" padding={2} border="1px solid #ccc" borderRadius="4px">
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <CardJobCompany
            jobTitle="Senior Developer"
            jobLocation="Milan, Italy"
            companyName="Slack"
            companyLogo="https://assets.maccarianagency.com/the-front/logos/slack.svg"
            jobsCount="2 jobs"
            companyInfo="Sync your team's work and activity to share automatically in a channel with a simple plugin."
          />
        </Grid>
        <Grid item xs={4}>
          <CardJobCompany
            jobTitle="Web designer internship"
            jobLocation="Milan, Italy"
            companyName="Slack"
            companyLogo="https://assets.maccarianagency.com/the-front/logos/slack.svg"
            jobsCount="2 jobs"
            companyInfo="Sync your team's work and activity to share automatically in a channel with a simple plugin."
          />
        </Grid>
        <Grid item xs={4}>
          <CardJobCompany
            jobTitle="UI/UX Designer"
            jobLocation="Milan, Italy"
            companyName="Slack"
            companyLogo="https://assets.maccarianagency.com/the-front/logos/slack.svg"
            jobsCount="2 jobs"
            companyInfo="Sync your team's work and activity to share automatically in a channel with a simple plugin."
          />
        </Grid>
      </Grid>
    </Box>
  );
}
`;

const exampleCode2 = `
import React from 'react';
import { Box, Grid } from '@material-ui/core';
import { CardJobCompany } from 'components/organisms';

export default function Example() {
  return (
    <Box marginBottom={2} display="flex" justifyContent="space-evenly" alignItems="center" padding={2} border="1px solid #ccc" borderRadius="4px">
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <CardJobCompany
            jobTitle="Senior Developer"
            jobLocation="Milan, Italy"
            companyName="Slack"
            companyLogo="https://assets.maccarianagency.com/the-front/logos/slack.svg"
            jobsCount="2 jobs"
            companyInfo="Sync your team's work and activity to share automatically in a channel with a simple plugin."
            variant="outlined"
          />
        </Grid>
        <Grid item xs={4}>
          <CardJobCompany
            jobTitle="Web designer internship"
            jobLocation="Milan, Italy"
            companyName="Slack"
            companyLogo="https://assets.maccarianagency.com/the-front/logos/slack.svg"
            jobsCount="2 jobs"
            companyInfo="Sync your team's work and activity to share automatically in a channel with a simple plugin."
            variant="outlined"
          />
        </Grid>
        <Grid item xs={4}>
          <CardJobCompany
            jobTitle="UI/UX Designer"
            jobLocation="Milan, Italy"
            companyName="Slack"
            companyLogo="https://assets.maccarianagency.com/the-front/logos/slack.svg"
            jobsCount="2 jobs"
            companyInfo="Sync your team's work and activity to share automatically in a channel with a simple plugin."
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
import { Box, Grid } from '@material-ui/core';
import { CardJobCompany } from 'components/organisms';

export default function Example() {
  return (
    <Box marginBottom={2} display="flex" justifyContent="space-evenly" alignItems="center" padding={2} border="1px solid #ccc" borderRadius="4px">
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <CardJobCompany
            jobTitle="Senior Developer"
            jobLocation="Milan, Italy"
            companyName="Slack"
            companyLogo="https://assets.maccarianagency.com/the-front/logos/slack.svg"
            jobsCount="2 jobs"
            companyInfo="Sync your team's work and activity to share automatically in a channel with a simple plugin."
            withShadow
            liftUp
          />
        </Grid>
        <Grid item xs={4}>
          <CardJobCompany
            jobTitle="Web designer internship"
            jobLocation="Milan, Italy"
            companyName="Slack"
            companyLogo="https://assets.maccarianagency.com/the-front/logos/slack.svg"
            jobsCount="2 jobs"
            companyInfo="Sync your team's work and activity to share automatically in a channel with a simple plugin."
            withShadow
            liftUp
          />
        </Grid>
        <Grid item xs={4}>
          <CardJobCompany
            jobTitle="UI/UX Designer"
            jobLocation="Milan, Italy"
            companyName="Slack"
            companyLogo="https://assets.maccarianagency.com/the-front/logos/slack.svg"
            jobsCount="2 jobs"
            companyInfo="Sync your team's work and activity to share automatically in a channel with a simple plugin."
            withShadow
            liftUp
          />
        </Grid>
      </Grid>
    </Box>
  );
}
`;

const CardJobCompanyExample = ({ ...rest }) => (
  <div {...rest}>
    <SectionBox title="Description" gutterBottom>
      <Headline
        title="CardJobCompany"
        path="src/components/organisms/CardJobCompany/CardJobCompany.js"
        description="Component to display the job card company"
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
          <Box display="flex" justifyContent="space-around" alignItems="center" minWidth="1000px">
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <CardJobCompany
                  jobTitle="Senior Developer"
                  jobLocation="Milan, Italy"
                  companyName="Slack"
                  companyLogo="https://assets.maccarianagency.com/the-front/logos/slack.svg"
                  jobsCount="2 jobs"
                  companyInfo="Sync your team's work and activity to share automatically in a channel with a simple plugin."
                />
              </Grid>
              <Grid item xs={4}>
                <CardJobCompany
                  jobTitle="Web designer internship"
                  jobLocation="Milan, Italy"
                  companyName="Slack"
                  companyLogo="https://assets.maccarianagency.com/the-front/logos/slack.svg"
                  jobsCount="2 jobs"
                  companyInfo="Sync your team's work and activity to share automatically in a channel with a simple plugin."
                />
              </Grid>
              <Grid item xs={4}>
                <CardJobCompany
                  jobTitle="UI/UX Designer"
                  jobLocation="Milan, Italy"
                  companyName="Slack"
                  companyLogo="https://assets.maccarianagency.com/the-front/logos/slack.svg"
                  jobsCount="2 jobs"
                  companyInfo="Sync your team's work and activity to share automatically in a channel with a simple plugin."
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
          <Box display="flex" justifyContent="space-around" alignItems="center" minWidth="1000px">
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <CardJobCompany
                  jobTitle="Senior Developer"
                  jobLocation="Milan, Italy"
                  companyName="Slack"
                  companyLogo="https://assets.maccarianagency.com/the-front/logos/slack.svg"
                  jobsCount="2 jobs"
                  companyInfo="Sync your team's work and activity to share automatically in a channel with a simple plugin."
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={4}>
                <CardJobCompany
                  jobTitle="Web designer internship"
                  jobLocation="Milan, Italy"
                  companyName="Slack"
                  companyLogo="https://assets.maccarianagency.com/the-front/logos/slack.svg"
                  jobsCount="2 jobs"
                  companyInfo="Sync your team's work and activity to share automatically in a channel with a simple plugin."
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={4}>
                <CardJobCompany
                  jobTitle="UI/UX Designer"
                  jobLocation="Milan, Italy"
                  companyName="Slack"
                  companyLogo="https://assets.maccarianagency.com/the-front/logos/slack.svg"
                  jobsCount="2 jobs"
                  companyInfo="Sync your team's work and activity to share automatically in a channel with a simple plugin."
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
          <Box display="flex" justifyContent="space-around" alignItems="center" minWidth="1000px">
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <CardJobCompany
                  jobTitle="Senior Developer"
                  jobLocation="Milan, Italy"
                  companyName="Slack"
                  companyLogo="https://assets.maccarianagency.com/the-front/logos/slack.svg"
                  jobsCount="2 jobs"
                  companyInfo="Sync your team's work and activity to share automatically in a channel with a simple plugin."
                  withShadow
                  liftUp
                />
              </Grid>
              <Grid item xs={4}>
                <CardJobCompany
                  jobTitle="Web designer internship"
                  jobLocation="Milan, Italy"
                  companyName="Slack"
                  companyLogo="https://assets.maccarianagency.com/the-front/logos/slack.svg"
                  jobsCount="2 jobs"
                  companyInfo="Sync your team's work and activity to share automatically in a channel with a simple plugin."
                  withShadow
                  liftUp
                />
              </Grid>
              <Grid item xs={4}>
                <CardJobCompany
                  jobTitle="UI/UX Designer"
                  jobLocation="Milan, Italy"
                  companyName="Slack"
                  companyLogo="https://assets.maccarianagency.com/the-front/logos/slack.svg"
                  jobsCount="2 jobs"
                  companyInfo="Sync your team's work and activity to share automatically in a channel with a simple plugin."
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

export default CardJobCompanyExample;
