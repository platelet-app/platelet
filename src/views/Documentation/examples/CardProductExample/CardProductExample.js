import React from 'react';
import { Box, Grid, Typography } from '@material-ui/core';
import { Headline, CodeHighlighter, PropsHighlighter, SectionBox } from '../../components';
import { CardProduct } from 'components/organisms';
import { SwiperImage } from 'components/molecules';

const importCodeString = `
import { CardProduct } from 'components/organisms';
// or
import CardProduct from 'components/organisms/CardProduct';
`;

const dataProperties = [{
  name: 'cardContent',
  type: 'any',
  default: '',
  description: 'The Card content',
}, {
  name: 'mediaContent',
  type: 'any',
  default: '',
  description: 'The Card Media content',
}, {
  name: 'align',
  type: 'enum',
  default: 'left',
  description: 'The content alignment. One of: left, right, center',
}, {
  name: 'liftUp',
  type: 'bool',
  default: '',
  description: 'Whether to lift up on hover',
}, {
  name: 'mediaClassName',
  type: 'string',
  default: '',
  description: 'External classes for the media',
}, {
  name: 'noBg',
  type: 'bool',
  default: '',
  description: 'Whether to show transparent background',
}, {
  name: 'noBorder',
  type: 'bool',
  default: '',
  description: 'Whether to hide the card borders',
}, {
  name: 'noShadow',
  type: 'bool',
  default: '',
  description: 'Whether to render the card without shadow',
}, {
  name: 'withShadow',
  type: 'bool',
  default: '',
  description: 'Whether to show custom shadow',
}, {
  name: 'className',
  type: 'string',
  default: '',
  description: 'External classes',
}];

const exampleCode1 = `
import React from 'react';
import { Box, Grid, Typography } from '@material-ui/core';
import { CardProduct } from 'components/organisms';
import { SwiperImage } from 'components/molecules';

const item = {
  images: [{
      src: 'https://assets.maccarianagency.com/the-front/photos/coworking/place3.jpg',
      alt: '', 
  }, {
      src: 'https://assets.maccarianagency.com/the-front/photos/coworking/place1.jpg',
      alt: '', 
  }, {
      src: 'https://assets.maccarianagency.com/the-front/photos/coworking/place2.jpg',
      alt: '', 
  }],
  title: 'Tenoha Space',
  address: 'Via E. Gola 4, 20147 Milan, Italy',
  price: '$980 / month',
};

export default function Example() {
  return (
    <Box marginBottom={2} padding={2} border="1px solid #ccc" borderRadius="4px">
      <CardProduct
        style={{ maxWidth: 500 }}
        mediaContent={(
          <>
            <SwiperImage
              items={item.images}
            />
            <div style={{ position: 'absolute', left: 8, bottom: 16, zIndex: 9, background: 'white', padding: '4px 8px', borderRadius: '8px' }}>
              <Typography variant="body1" color="primary">
                {item.price}
              </Typography>
            </div>
          </>
        )}
        cardContent={(
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Typography variant="h6" color="textPrimary" align="left">
                {item.title}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1" color="textSecondary" align="left">{item.address}</Typography>
            </Grid>
          </Grid>
        )}
      />
    </Box>
  );
}
`;

const exampleCode2 = `
import React from 'react';
import { Box, Grid, Typography } from '@material-ui/core';
import { CardProduct } from 'components/organisms';
import { SwiperImage } from 'components/molecules';

const item = {
  images: [{
      src: 'https://assets.maccarianagency.com/the-front/photos/coworking/place3.jpg',
      alt: '', 
  }, {
      src: 'https://assets.maccarianagency.com/the-front/photos/coworking/place1.jpg',
      alt: '', 
  }, {
      src: 'https://assets.maccarianagency.com/the-front/photos/coworking/place2.jpg',
      alt: '', 
  }],
  title: 'Tenoha Space',
  address: 'Via E. Gola 4, 20147 Milan, Italy',
  price: '$980 / month',
};

export default function Example() {
  return (
    <Box marginBottom={2} padding={2} border="1px solid #ccc" borderRadius="4px">
      <CardProduct
        withShadow
        style={{ maxWidth: 500 }}
        mediaContent={(
          <>
            <SwiperImage
              items={item.images}
            />
            <div style={{ position: 'absolute', left: 8, bottom: 16, zIndex: 9, background: 'white', padding: '4px 8px', borderRadius: '8px' }}>
              <Typography variant="body1" color="primary">
                {item.price}
              </Typography>
            </div>
          </>
        )}
        cardContent={(
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Typography variant="h6" color="textPrimary" align="left">
                {item.title}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1" color="textSecondary" align="left">{item.address}</Typography>
            </Grid>
          </Grid>
        )}
      />
    </Box>
  );
}
`;

const exampleCode3 = `
import React from 'react';
import { Box, Grid, Typography } from '@material-ui/core';
import { CardProduct } from 'components/organisms';
import { SwiperImage } from 'components/molecules';

const item = {
  images: [{
      src: 'https://assets.maccarianagency.com/the-front/photos/coworking/place3.jpg',
      alt: '', 
  }, {
      src: 'https://assets.maccarianagency.com/the-front/photos/coworking/place1.jpg',
      alt: '', 
  }, {
      src: 'https://assets.maccarianagency.com/the-front/photos/coworking/place2.jpg',
      alt: '', 
  }],
  title: 'Tenoha Space',
  address: 'Via E. Gola 4, 20147 Milan, Italy',
  price: '$980 / month',
};

export default function Example() {
  return (
    <Box marginBottom={2} padding={2} border="1px solid #ccc" borderRadius="4px">
      <CardProduct
        withShadow
        liftUp
        style={{ maxWidth: 500 }}
        mediaContent={(
          <>
            <SwiperImage
              items={item.images}
            />
            <div style={{ position: 'absolute', left: 8, bottom: 16, zIndex: 9, background: 'white', padding: '4px 8px', borderRadius: '8px' }}>
              <Typography variant="body1" color="primary">
                {item.price}
              </Typography>
            </div>
          </>
        )}
        cardContent={(
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Typography variant="h6" color="textPrimary" align="left">
                {item.title}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1" color="textSecondary" align="left">{item.address}</Typography>
            </Grid>
          </Grid>
        )}
      />
    </Box>
  );
}
`;

const exampleCode4 = `
import React from 'react';
import { Box, Grid, Typography } from '@material-ui/core';
import { CardProduct } from 'components/organisms';
import { SwiperImage } from 'components/molecules';

const item = {
  images: [{
      src: 'https://assets.maccarianagency.com/the-front/photos/coworking/place3.jpg',
      alt: '', 
  }, {
      src: 'https://assets.maccarianagency.com/the-front/photos/coworking/place1.jpg',
      alt: '', 
  }, {
      src: 'https://assets.maccarianagency.com/the-front/photos/coworking/place2.jpg',
      alt: '', 
  }],
  title: 'Tenoha Space',
  address: 'Via E. Gola 4, 20147 Milan, Italy',
  price: '$980 / month',
};

export default function Example() {
  return (
    <Box marginBottom={2} padding={2} border="1px solid #ccc" borderRadius="4px">
      <CardProduct
        noBorder
        noShadow
        style={{ maxWidth: 500 }}
        mediaContent={(
          <>
            <SwiperImage
              items={item.images}
            />
            <div style={{ position: 'absolute', left: 8, bottom: 16, zIndex: 9, background: 'white', padding: '4px 8px', borderRadius: '8px' }}>
              <Typography variant="body1" color="primary">
                {item.price}
              </Typography>
            </div>
          </>
        )}
        cardContent={(
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Typography variant="h6" color="textPrimary" align="left">
                {item.title}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1" color="textSecondary" align="left">{item.address}</Typography>
            </Grid>
          </Grid>
        )}
      />
    </Box>
  );
}
`;

const exampleCode5 = `
import React from 'react';
import { Box, Grid, Typography } from '@material-ui/core';
import { CardProduct } from 'components/organisms';
import { SwiperImage } from 'components/molecules';

const item = {
  images: [{
      src: 'https://assets.maccarianagency.com/the-front/photos/coworking/place3.jpg',
      alt: '', 
  }, {
      src: 'https://assets.maccarianagency.com/the-front/photos/coworking/place1.jpg',
      alt: '', 
  }, {
      src: 'https://assets.maccarianagency.com/the-front/photos/coworking/place2.jpg',
      alt: '', 
  }],
  title: 'Tenoha Space',
  address: 'Via E. Gola 4, 20147 Milan, Italy',
  price: '$980 / month',
};

export default function Example() {
  return (
    <Box marginBottom={2} padding={2} border="1px solid #ccc" borderRadius="4px">
      <CardProduct
        variant="outlined"
        style={{ maxWidth: 500 }}
        mediaContent={(
          <>
            <SwiperImage
              items={item.images}
            />
            <div style={{ position: 'absolute', left: 8, bottom: 16, zIndex: 9, background: 'white', padding: '4px 8px', borderRadius: '8px' }}>
              <Typography variant="body1" color="primary">
                {item.price}
              </Typography>
            </div>
          </>
        )}
        cardContent={(
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Typography variant="h6" color="textPrimary" align="left">
                {item.title}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1" color="textSecondary" align="left">{item.address}</Typography>
            </Grid>
          </Grid>
        )}
      />
    </Box>
  );
}
`;

const item = {
  images: [{
      src: 'https://assets.maccarianagency.com/the-front/photos/coworking/place3.jpg',
      alt: '', 
  }, {
      src: 'https://assets.maccarianagency.com/the-front/photos/coworking/place1.jpg',
      alt: '', 
  }, {
      src: 'https://assets.maccarianagency.com/the-front/photos/coworking/place2.jpg',
      alt: '', 
  }],
  title: 'Tenoha Space',
  address: 'Via E. Gola 4, 20147 Milan, Italy',
  price: '$980 / month',
};

const CardProductExample = ({ ...rest }) => (
  <div {...rest}>
    <SectionBox title="Description" gutterBottom>
      <Headline
        title="CardProduct"
        path="src/components/organisms/CardProduct/CardProduct.js"
        description="Component to display the product card"
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
          <CardProduct
            style={{ maxWidth: 500 }}
            mediaContent={(
              <>
                <SwiperImage
                  items={item.images}
                />
                <div style={{ position: 'absolute', left: 8, bottom: 16, zIndex: 9, background: 'white', padding: '4px 8px', borderRadius: '8px' }}>
                  <Typography variant="body1" color="primary">
                    {item.price}
                  </Typography>
                </div>
              </>
            )}
            cardContent={(
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Typography variant="h6" color="textPrimary" align="left">
                    {item.title}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1" color="textSecondary" align="left">{item.address}</Typography>
                </Grid>
              </Grid>
            )}
          />
        </Box>
        <CodeHighlighter code={exampleCode1} />
      </>
    </SectionBox>
    <SectionBox title="Custom Shadow Example" gutterBottom>
      <>
        <Box marginBottom={2} padding={2} border="1px solid #ccc" borderRadius="4px">
          <CardProduct
            withShadow
            style={{ maxWidth: 500 }}
            mediaContent={(
              <>
                <SwiperImage
                  items={item.images}
                />
                <div style={{ position: 'absolute', left: 8, bottom: 16, zIndex: 9, background: 'white', padding: '4px 8px', borderRadius: '8px' }}>
                  <Typography variant="body1" color="primary">
                    {item.price}
                  </Typography>
                </div>
              </>
            )}
            cardContent={(
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Typography variant="h6" color="textPrimary" align="left">
                    {item.title}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1" color="textSecondary" align="left">{item.address}</Typography>
                </Grid>
              </Grid>
            )}
          />
        </Box>
        <CodeHighlighter code={exampleCode2} />
      </>
    </SectionBox>
    <SectionBox title="LiftUp Effect Example" gutterBottom>
      <>
        <Box marginBottom={2} padding={2} border="1px solid #ccc" borderRadius="4px">
          <CardProduct
            withShadow
            liftUp
            style={{ maxWidth: 500 }}
            mediaContent={(
              <>
                <SwiperImage
                  items={item.images}
                />
                <div style={{ position: 'absolute', left: 8, bottom: 16, zIndex: 9, background: 'white', padding: '4px 8px', borderRadius: '8px' }}>
                  <Typography variant="body1" color="primary">
                    {item.price}
                  </Typography>
                </div>
              </>
            )}
            cardContent={(
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Typography variant="h6" color="textPrimary" align="left">
                    {item.title}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1" color="textSecondary" align="left">{item.address}</Typography>
                </Grid>
              </Grid>
            )}
          />
        </Box>
        <CodeHighlighter code={exampleCode3} />
      </>
    </SectionBox>
    <SectionBox title="Basic Card with No Border and No Shadow Example" gutterBottom>
      <>
        <Box marginBottom={2} padding={2} border="1px solid #ccc" borderRadius="4px">
          <CardProduct
            noBorder
            noShadow
            style={{ maxWidth: 500 }}
            mediaContent={(
              <>
                <SwiperImage
                  items={item.images}
                />
                <div style={{ position: 'absolute', left: 8, bottom: 16, zIndex: 9, background: 'white', padding: '4px 8px', borderRadius: '8px' }}>
                  <Typography variant="body1" color="primary">
                    {item.price}
                  </Typography>
                </div>
              </>
            )}
            cardContent={(
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Typography variant="h6" color="textPrimary" align="left">
                    {item.title}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1" color="textSecondary" align="left">{item.address}</Typography>
                </Grid>
              </Grid>
            )}
          />
        </Box>
        <CodeHighlighter code={exampleCode4} />
      </>
    </SectionBox>
    <SectionBox title="Basic Card with Outlined Effect" gutterBottom>
      <>
        <Box marginBottom={2} padding={2} border="1px solid #ccc" borderRadius="4px">
          <CardProduct
            variant="outlined"
            style={{ maxWidth: 500 }}
            mediaContent={(
              <>
                <SwiperImage
                  items={item.images}
                />
                <div style={{ position: 'absolute', left: 8, bottom: 16, zIndex: 9, background: 'white', padding: '4px 8px', borderRadius: '8px' }}>
                  <Typography variant="body1" color="primary">
                    {item.price}
                  </Typography>
                </div>
              </>
            )}
            cardContent={(
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Typography variant="h6" color="textPrimary" align="left">
                    {item.title}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1" color="textSecondary" align="left">{item.address}</Typography>
                </Grid>
              </Grid>
            )}
          />
        </Box>
        <CodeHighlighter code={exampleCode5} />
      </>
    </SectionBox>
  </div>
);

export default CardProductExample;
