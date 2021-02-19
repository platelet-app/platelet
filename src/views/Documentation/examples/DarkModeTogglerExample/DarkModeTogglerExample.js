import React, { useState } from 'react';
import { Box } from '@material-ui/core';
import { Headline, CodeHighlighter, PropsHighlighter, SectionBox } from '../../components';
import { DarkModeToggler } from 'components/atoms';

const importCodeString = `
import { DarkModeToggler } from 'components/atoms';
// or
import DarkModeToggler from 'components/atoms/DarkModeToggler';
`;

const dataProperties = [{
  name: 'themeMode',
  type: 'string',
  default: '',
  description: 'The theme mode',
}, {
  name: 'className',
  type: 'string',
  default: '',
  description: 'External classes',
}, {
  name: 'onClick',
  type: 'Function',
  default: '',
  description: 'Function to handle the click of teh toggler',
}];

const exampleCode = `
import React, { useState } from 'react';
import { Box } from '@material-ui/core';
import { DarkModeToggler } from 'components/atoms';

export default function DarkModeTogglerExample() {
  const [themeMode, setThemeMode] = useState('light');
  const handleClick = () => setThemeMode(themeMode === 'light' ? 'dark' : 'light');

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" padding={2} border="1px solid #ccc" borderRadius="4px">
      <DarkModeToggler themeMode={themeMode} onClick={() => handleClick()} />
    </Box>
  );
}
`;

const DarkModeTogglerExample = ({ ...rest }) => {
  const [themeMode, setThemeMode] = useState('light');
  const handleClick = () => setThemeMode(themeMode === 'light' ? 'dark' : 'light');

  return (
    <div {...rest}>
      <SectionBox title="Description" gutterBottom>
        <Headline
          title="DarkModeToggler"
          path="src/components/atoms/DarkModeToggler/DarkModeToggler.js"
          description="Component to display the dark mode toggler"
        />
      </SectionBox>
      <SectionBox title="Import" gutterBottom>
        <CodeHighlighter code={importCodeString} />
      </SectionBox>
      <SectionBox title="Props & Methods" gutterBottom>
        <PropsHighlighter dataProperties={dataProperties} />
      </SectionBox>
      <SectionBox title="Example" gutterBottom>
        <>
          <Box marginBottom={2} display="flex" justifyContent="space-between" alignItems="center" padding={2} border="1px solid #ccc" borderRadius="4px">
            <DarkModeToggler themeMode={themeMode} onClick={() => handleClick()} />
          </Box>
          <CodeHighlighter code={exampleCode} />
        </>
      </SectionBox>
    </div>
  )
};

export default DarkModeTogglerExample;
