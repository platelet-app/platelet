import React from 'react';
import { Box, colors, Grid, Button, Typography } from '@material-ui/core';
import { Headline, CodeHighlighter, PropsHighlighter, SectionBox } from '../../components';
import { CardPricingStandard } from 'components/organisms';
import { Icon } from 'components/atoms';

const importCodeString = `
import { CardPricingStandard } from 'components/organisms';
// or
import CardPricingStandard from 'components/organisms/CardPricingStandard';
`;

const dataProperties = [{
  name: 'cta',
  type: 'node',
  default: '',
  description: 'CTA button of the pricing card',
}, {
  name: 'priceComponent',
  type: 'node',
  default: '',
  description: 'The pricing component of the pricing card',
}, {
  name: 'title',
  type: 'string',
  default: '',
  description: 'Title of the pricing card',
}, {
  name: 'disclaimer',
  type: 'string',
  default: '',
  description: 'Diclaimer of the pricing card',
}, {
  name: 'disclaimerProps',
  type: 'object',
  default: '',
  description: 'Additional props to pass to the disclaimer Typography component',
}, {
  name: 'featureCheckComponent',
  type: 'node',
  default: '',
  description: 'The features check component of the pricing card',
}, {
  name: 'featureTitleProps',
  type: 'object',
  default: '',
  description: 'Additional props to pass to the feature title Typography component',
}, {
  name: 'features',
  type: 'array',
  default: '',
  description: 'Features array of the pricing card',
}, {
  name: 'subtitle',
  type: 'string',
  default: '',
  description: 'Subtitle of the pricing card',
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
}, {
  name: 'className',
  type: 'string',
  default: '',
  description: 'External classes',
}];

const exampleCode1 = `
import React from 'react';
import { Box, colors, Grid, Button, Typography } from '@material-ui/core';
import { CardPricingStandard } from 'components/organisms';
import { Icon } from 'components/atoms';

export default function Example() {
  return (
    <Box marginBottom={2} padding={2} border="1px solid #ccc" borderRadius="4px">
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <CardPricingStandard
            title="Extended License"
            subtitle="A pay-once license, just for you"
            priceComponent={(
                <div>
                    <Typography variant="h3" component="span" style={{ fontWeight: 900 }}>$79</Typography>
                    <Typography component="span" variant="subtitle1">/ MO</Typography>
                </div>
            )}
            features={['Rich, responsive landing pages', '100+ styled components', 'Flexible, simple license', 'Speedy build tooling', '6 months free support included']}
            featureCheckComponent={<Icon fontIconClass="far fa-check-circle" fontIconColor={colors.indigo[500]} />}
            cta={(<Button color="primary" variant="outlined" fullWidth size="large">Subscribe now</Button>)}
            disclaimer="Fully featured 30-day free trial"
          />
        </Grid>
        <Grid item xs={4}>
          <CardPricingStandard
            title="Extended License"
            subtitle="A pay-once license, just for you"
            priceComponent={(
                <div>
                    <Typography variant="h3" component="span" style={{ fontWeight: 900 }}>$79</Typography>
                    <Typography component="span" variant="subtitle1">/ MO</Typography>
                </div>
            )}
            features={['Rich, responsive landing pages', '100+ styled components', 'Flexible, simple license', 'Speedy build tooling', '6 months free support included']}
            featureCheckComponent={<Icon fontIconClass="far fa-check-circle" fontIconColor={colors.indigo[500]} />}
            cta={(<Button color="primary" variant="contained" fullWidth size="large">Subscribe now</Button>)}
            disclaimer="Fully featured 30-day free trial"
          />
        </Grid>
        <Grid item xs={4}>
          <CardPricingStandard
            title="Extended License"
            subtitle="A pay-once license, just for you"
            priceComponent={(
                <div>
                    <Typography variant="h3" component="span" style={{ fontWeight: 900 }}>$79</Typography>
                    <Typography component="span" variant="subtitle1">/ MO</Typography>
                </div>
            )}
            features={['Rich, responsive landing pages', '100+ styled components', 'Flexible, simple license', 'Speedy build tooling', '6 months free support included']}
            featureCheckComponent={<Icon fontIconClass="far fa-check-circle" fontIconColor={colors.indigo[500]} />}
            cta={(<Button color="primary" variant="outlined" fullWidth size="large">Subscribe now</Button>)}
            disclaimer="Fully featured 30-day free trial"
          />
        </Grid>
      </Grid>
    </Box>
  );
}
`;

const exampleCode2 = `
import React from 'react';
import { Box, colors, Grid, Button, Typography } from '@material-ui/core';
import { CardPricingStandard } from 'components/organisms';
import { Icon } from 'components/atoms';

export default function Example() {
  return (
    <Box marginBottom={2} padding={2} border="1px solid #ccc" borderRadius="4px">
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <CardPricingStandard
            title="Extended License"
            subtitle="A pay-once license, just for you"
            priceComponent={(
                <div>
                    <Typography variant="h3" component="span" style={{ fontWeight: 900 }}>$79</Typography>
                    <Typography component="span" variant="subtitle1">/ MO</Typography>
                </div>
            )}
            features={['Rich, responsive landing pages', '100+ styled components', 'Flexible, simple license', 'Speedy build tooling', '6 months free support included']}
            featureCheckComponent={<Icon fontIconClass="far fa-check-circle" fontIconColor={colors.indigo[500]} />}
            cta={(<Button color="primary" variant="outlined" fullWidth size="large">Subscribe now</Button>)}
            disclaimer="Fully featured 30-day free trial"
            variant="outlined"
          />
        </Grid>
        <Grid item xs={4}>
          <CardPricingStandard
            title="Extended License"
            subtitle="A pay-once license, just for you"
            priceComponent={(
                <div>
                    <Typography variant="h3" component="span" style={{ fontWeight: 900 }}>$79</Typography>
                    <Typography component="span" variant="subtitle1">/ MO</Typography>
                </div>
            )}
            features={['Rich, responsive landing pages', '100+ styled components', 'Flexible, simple license', 'Speedy build tooling', '6 months free support included']}
            featureCheckComponent={<Icon fontIconClass="far fa-check-circle" fontIconColor={colors.indigo[500]} />}
            cta={(<Button color="primary" variant="contained" fullWidth size="large">Subscribe now</Button>)}
            disclaimer="Fully featured 30-day free trial"
            variant="outlined"
          />
        </Grid>
        <Grid item xs={4}>
          <CardPricingStandard
            title="Extended License"
            subtitle="A pay-once license, just for you"
            priceComponent={(
                <div>
                    <Typography variant="h3" component="span" style={{ fontWeight: 900 }}>$79</Typography>
                    <Typography component="span" variant="subtitle1">/ MO</Typography>
                </div>
            )}
            features={['Rich, responsive landing pages', '100+ styled components', 'Flexible, simple license', 'Speedy build tooling', '6 months free support included']}
            featureCheckComponent={<Icon fontIconClass="far fa-check-circle" fontIconColor={colors.indigo[500]} />}
            cta={(<Button color="primary" variant="outlined" fullWidth size="large">Subscribe now</Button>)}
            disclaimer="Fully featured 30-day free trial"
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
import { Box, colors, Grid, Button, Typography } from '@material-ui/core';
import { CardPricingStandard } from 'components/organisms';
import { Icon } from 'components/atoms';

export default function Example() {
  return (
    <Box marginBottom={2} padding={2} border="1px solid #ccc" borderRadius="4px">
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <CardPricingStandard
            title="Extended License"
            subtitle="A pay-once license, just for you"
            priceComponent={(
                <div>
                    <Typography variant="h3" component="span" style={{ fontWeight: 900 }}>$79</Typography>
                    <Typography component="span" variant="subtitle1">/ MO</Typography>
                </div>
            )}
            features={['Rich, responsive landing pages', '100+ styled components', 'Flexible, simple license', 'Speedy build tooling', '6 months free support included']}
            featureCheckComponent={<Icon fontIconClass="far fa-check-circle" fontIconColor={colors.indigo[500]} />}
            cta={(<Button color="primary" variant="outlined" fullWidth size="large">Subscribe now</Button>)}
            disclaimer="Fully featured 30-day free trial"
            withShadow
            liftUp
          />
        </Grid>
        <Grid item xs={4}>
          <CardPricingStandard
            title="Extended License"
            subtitle="A pay-once license, just for you"
            priceComponent={(
                <div>
                    <Typography variant="h3" component="span" style={{ fontWeight: 900 }}>$79</Typography>
                    <Typography component="span" variant="subtitle1">/ MO</Typography>
                </div>
            )}
            features={['Rich, responsive landing pages', '100+ styled components', 'Flexible, simple license', 'Speedy build tooling', '6 months free support included']}
            featureCheckComponent={<Icon fontIconClass="far fa-check-circle" fontIconColor={colors.indigo[500]} />}
            cta={(<Button color="primary" variant="contained" fullWidth size="large">Subscribe now</Button>)}
            disclaimer="Fully featured 30-day free trial"
            withShadow
            liftUp
          />
        </Grid>
        <Grid item xs={4}>
          <CardPricingStandard
            title="Extended License"
            subtitle="A pay-once license, just for you"
            priceComponent={(
                <div>
                    <Typography variant="h3" component="span" style={{ fontWeight: 900 }}>$79</Typography>
                    <Typography component="span" variant="subtitle1">/ MO</Typography>
                </div>
            )}
            features={['Rich, responsive landing pages', '100+ styled components', 'Flexible, simple license', 'Speedy build tooling', '6 months free support included']}
            featureCheckComponent={<Icon fontIconClass="far fa-check-circle" fontIconColor={colors.indigo[500]} />}
            cta={(<Button color="primary" variant="outlined" fullWidth size="large">Subscribe now</Button>)}
            disclaimer="Fully featured 30-day free trial"
            withShadow
            liftUp
          />
        </Grid>
      </Grid>
    </Box>
  );
}
`;

const CardPricingStandardExample = ({ ...rest }) => (
  <div {...rest}>
    <SectionBox title="Description" gutterBottom>
      <Headline
        title="CardPricingStandard"
        path="src/components/organisms/CardPricingStandard/CardPricingStandard.js"
        description="Component to display the pricing card"
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
                <CardPricingStandard
                  title="Extended License"
                  subtitle="A pay-once license, just for you"
                  priceComponent={(
                      <div>
                          <Typography variant="h3" component="span" style={{ fontWeight: 900 }}>$79</Typography>
                          <Typography component="span" variant="subtitle1">/ MO</Typography>
                      </div>
                  )}
                  features={['Rich, responsive landing pages', '100+ styled components', 'Flexible, simple license', 'Speedy build tooling', '6 months free support included']}
                  featureCheckComponent={<Icon fontIconClass="far fa-check-circle" fontIconColor={colors.indigo[500]} />}
                  cta={(<Button color="primary" variant="outlined" fullWidth size="large">Subscribe now</Button>)}
                  disclaimer="Fully featured 30-day free trial"
                />
              </Grid>
              <Grid item xs={4}>
                <CardPricingStandard
                  title="Extended License"
                  subtitle="A pay-once license, just for you"
                  priceComponent={(
                      <div>
                          <Typography variant="h3" component="span" style={{ fontWeight: 900 }}>$79</Typography>
                          <Typography component="span" variant="subtitle1">/ MO</Typography>
                      </div>
                  )}
                  features={['Rich, responsive landing pages', '100+ styled components', 'Flexible, simple license', 'Speedy build tooling', '6 months free support included']}
                  featureCheckComponent={<Icon fontIconClass="far fa-check-circle" fontIconColor={colors.indigo[500]} />}
                  cta={(<Button color="primary" variant="contained" fullWidth size="large">Subscribe now</Button>)}
                  disclaimer="Fully featured 30-day free trial"
                />
              </Grid>
              <Grid item xs={4}>
                <CardPricingStandard
                  title="Extended License"
                  subtitle="A pay-once license, just for you"
                  priceComponent={(
                      <div>
                          <Typography variant="h3" component="span" style={{ fontWeight: 900 }}>$79</Typography>
                          <Typography component="span" variant="subtitle1">/ MO</Typography>
                      </div>
                  )}
                  features={['Rich, responsive landing pages', '100+ styled components', 'Flexible, simple license', 'Speedy build tooling', '6 months free support included']}
                  featureCheckComponent={<Icon fontIconClass="far fa-check-circle" fontIconColor={colors.indigo[500]} />}
                  cta={(<Button color="primary" variant="outlined" fullWidth size="large">Subscribe now</Button>)}
                  disclaimer="Fully featured 30-day free trial"
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
                <CardPricingStandard
                  title="Extended License"
                  subtitle="A pay-once license, just for you"
                  priceComponent={(
                      <div>
                          <Typography variant="h3" component="span" style={{ fontWeight: 900 }}>$79</Typography>
                          <Typography component="span" variant="subtitle1">/ MO</Typography>
                      </div>
                  )}
                  features={['Rich, responsive landing pages', '100+ styled components', 'Flexible, simple license', 'Speedy build tooling', '6 months free support included']}
                  featureCheckComponent={<Icon fontIconClass="far fa-check-circle" fontIconColor={colors.indigo[500]} />}
                  cta={(<Button color="primary" variant="outlined" fullWidth size="large">Subscribe now</Button>)}
                  disclaimer="Fully featured 30-day free trial"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={4}>
                <CardPricingStandard
                  title="Extended License"
                  subtitle="A pay-once license, just for you"
                  priceComponent={(
                      <div>
                          <Typography variant="h3" component="span" style={{ fontWeight: 900 }}>$79</Typography>
                          <Typography component="span" variant="subtitle1">/ MO</Typography>
                      </div>
                  )}
                  features={['Rich, responsive landing pages', '100+ styled components', 'Flexible, simple license', 'Speedy build tooling', '6 months free support included']}
                  featureCheckComponent={<Icon fontIconClass="far fa-check-circle" fontIconColor={colors.indigo[500]} />}
                  cta={(<Button color="primary" variant="contained" fullWidth size="large">Subscribe now</Button>)}
                  disclaimer="Fully featured 30-day free trial"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={4}>
                <CardPricingStandard
                  title="Extended License"
                  subtitle="A pay-once license, just for you"
                  priceComponent={(
                      <div>
                          <Typography variant="h3" component="span" style={{ fontWeight: 900 }}>$79</Typography>
                          <Typography component="span" variant="subtitle1">/ MO</Typography>
                      </div>
                  )}
                  features={['Rich, responsive landing pages', '100+ styled components', 'Flexible, simple license', 'Speedy build tooling', '6 months free support included']}
                  featureCheckComponent={<Icon fontIconClass="far fa-check-circle" fontIconColor={colors.indigo[500]} />}
                  cta={(<Button color="primary" variant="outlined" fullWidth size="large">Subscribe now</Button>)}
                  disclaimer="Fully featured 30-day free trial"
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
                <CardPricingStandard
                  title="Extended License"
                  subtitle="A pay-once license, just for you"
                  priceComponent={(
                      <div>
                          <Typography variant="h3" component="span" style={{ fontWeight: 900 }}>$79</Typography>
                          <Typography component="span" variant="subtitle1">/ MO</Typography>
                      </div>
                  )}
                  features={['Rich, responsive landing pages', '100+ styled components', 'Flexible, simple license', 'Speedy build tooling', '6 months free support included']}
                  featureCheckComponent={<Icon fontIconClass="far fa-check-circle" fontIconColor={colors.indigo[500]} />}
                  cta={(<Button color="primary" variant="outlined" fullWidth size="large">Subscribe now</Button>)}
                  disclaimer="Fully featured 30-day free trial"
                  withShadow
                  liftUp
                />
              </Grid>
              <Grid item xs={4}>
                <CardPricingStandard
                  title="Extended License"
                  subtitle="A pay-once license, just for you"
                  priceComponent={(
                      <div>
                          <Typography variant="h3" component="span" style={{ fontWeight: 900 }}>$79</Typography>
                          <Typography component="span" variant="subtitle1">/ MO</Typography>
                      </div>
                  )}
                  features={['Rich, responsive landing pages', '100+ styled components', 'Flexible, simple license', 'Speedy build tooling', '6 months free support included']}
                  featureCheckComponent={<Icon fontIconClass="far fa-check-circle" fontIconColor={colors.indigo[500]} />}
                  cta={(<Button color="primary" variant="contained" fullWidth size="large">Subscribe now</Button>)}
                  disclaimer="Fully featured 30-day free trial"
                  withShadow
                  liftUp
                />
              </Grid>
              <Grid item xs={4}>
                <CardPricingStandard
                  title="Extended License"
                  subtitle="A pay-once license, just for you"
                  priceComponent={(
                      <div>
                          <Typography variant="h3" component="span" style={{ fontWeight: 900 }}>$79</Typography>
                          <Typography component="span" variant="subtitle1">/ MO</Typography>
                      </div>
                  )}
                  features={['Rich, responsive landing pages', '100+ styled components', 'Flexible, simple license', 'Speedy build tooling', '6 months free support included']}
                  featureCheckComponent={<Icon fontIconClass="far fa-check-circle" fontIconColor={colors.indigo[500]} />}
                  cta={(<Button color="primary" variant="outlined" fullWidth size="large">Subscribe now</Button>)}
                  disclaimer="Fully featured 30-day free trial"
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

export default CardPricingStandardExample;
