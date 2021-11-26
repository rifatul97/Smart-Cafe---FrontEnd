import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import React, { useEffect, useState } from 'react';


export default function ProductListTable(props) {
  const rows = props.rows

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Product Name</TableCell>
            <TableCell align="right">Amount</TableCell>
            <TableCell align="right">Total Price</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.quantity}</TableCell>
              <TableCell align="right">${row.totalPrice}</TableCell>
            </TableRow>
          ))}
          <TableCell component="th" scope="row">
            overall
          </TableCell>
          <TableCell align="right"></TableCell>
          <TableCell align="right">{100}</TableCell>
        </TableBody>
      </Table>
    </TableContainer>
  );
}