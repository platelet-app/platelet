import React from 'react';
import PropTypes from 'prop-types';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';

const PropsHighlighter = ({ dataProperties, className, ...rest }) => (
  <div className={className} {...rest}>
    <TableContainer>
      <Table aria-label="props & mthods">
        <TableHead>
          <TableRow>
            <TableCell><b>Name</b></TableCell>
            <TableCell><b>Type</b></TableCell>
            <TableCell><b>Default</b></TableCell>
            <TableCell><b>Description</b></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {dataProperties.map((row) => (
            <TableRow key={row.name}>
              <TableCell>{row.name}</TableCell>
              <TableCell><i>{row.type}</i></TableCell>
              <TableCell>{row.default}</TableCell>
              <TableCell>{row.description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </div>
);

PropsHighlighter.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
  /**
   * Code
   */
  dataProperties: PropTypes.array.isRequired,
};

export default PropsHighlighter;
