import React from 'react';
import { Box } from '@material-ui/core';
import { Headline, CodeHighlighter, PropsHighlighter, SectionBox } from '../../components';
import { Map } from 'components/organisms';

const importCodeString = `
import { Map } from 'components/organisms';
// or
import Map from 'components/organisms/Map';
`;

const dataProperties = [{
  name: 'center',
  type: 'array',
  default: '[0, 0]',
  description: 'Map center',
}, {
  name: 'pins',
  type: 'array',
  default: '',
  description: 'data of the locations. Example: [{ location: { x: number, y: number } }]',
}, {
  name: 'zoom',
  type: 'number',
  default: '10',
  description: 'Map zoom',
}, {
  name: 'className',
  type: 'string',
  default: '',
  description: 'External classes',
}];

const exampleCode = `
import React from 'react';
import { Box } from '@material-ui/core';
import { Map } from 'components/organisms';

const mapData = [
  {
    location: {
      y: 45.453211,
      x: 9.248383,
      address: 'Via A.G. Alaimo 147, 55027',
    },
  },
  {
    location: {
      y: 45.419211,
      x: 9.021383,
      address: 'Via Rocca de Baldi 95, 440368',
    },
  },
  {
    location: {
      y: 45.473211,
      x: 9.298383,
      address: 'Via Firenze 134, 45588',
    },
  },
  {
    location: {
      y: 45.461211,
      x: 9.000383,
      address: 'Via Cavour 29, 201558',
    },
  },
  {
    location: {
      y: 45.413211,
      x: 9.398383,
      address: 'Via Bologna 33, 220156',
    },
  },
  {
    location: {
      y: 45.569211,
      x: 9.128383,
      address: 'Vicolo Tre Marchetti 127, 350125',
    },
  },
  {
    location: {
      y: 45.483211,
      x: 9.148383,
      address: 'Via Lombardi 146, 45830',
    },
  },
  {
    location: {
      y: 45.313211,
      x: 9.012383,
      address: 'Via Guantai Nuovi 99, 56989',
    },
  },
];

export default function Example() {
  return (
    <Box marginBottom={2} padding={2} border="1px solid #ccc" borderRadius="4px">
      <Map pins={mapData} center={[45.464211, 9.011383]} />
    </Box>
  );
}
`;

const mapData = [
  {
    location: {
      y: 45.453211,
      x: 9.248383,
      address: 'Via A.G. Alaimo 147, 55027',
    },
  },
  {
    location: {
      y: 45.419211,
      x: 9.021383,
      address: 'Via Rocca de Baldi 95, 440368',
    },
  },
  {
    location: {
      y: 45.473211,
      x: 9.298383,
      address: 'Via Firenze 134, 45588',
    },
  },
  {
    location: {
      y: 45.461211,
      x: 9.000383,
      address: 'Via Cavour 29, 201558',
    },
  },
  {
    location: {
      y: 45.413211,
      x: 9.398383,
      address: 'Via Bologna 33, 220156',
    },
  },
  {
    location: {
      y: 45.569211,
      x: 9.128383,
      address: 'Vicolo Tre Marchetti 127, 350125',
    },
  },
  {
    location: {
      y: 45.483211,
      x: 9.148383,
      address: 'Via Lombardi 146, 45830',
    },
  },
  {
    location: {
      y: 45.313211,
      x: 9.012383,
      address: 'Via Guantai Nuovi 99, 56989',
    },
  },
];

const MapExample = ({ ...rest }) => (
  <div {...rest}>
    <SectionBox title="Description" gutterBottom>
      <Headline
        title="Map"
        path="src/components/organisms/Map/Map.js"
        description="Component to display the map"
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
        <Box marginBottom={2} padding={2} border="1px solid #ccc" borderRadius="4px" position="relative" height="400px">
          <Map pins={mapData} center={[45.464211, 9.011383]} />
        </Box>
        <CodeHighlighter code={exampleCode} />
      </>
    </SectionBox>
  </div>
);

export default MapExample;
