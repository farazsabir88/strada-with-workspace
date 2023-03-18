/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-named-as-default */
import React from 'react';
import {
  useTable,
  useSortBy,
} from 'react-table';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import {
  Table, TableHead, TableRow, TableBody, TableCell,
} from '@mui/material';
import './_tableStyles.scss';
import type { ITableProps } from 'formsTypes';

export default function CustomTable(props: ITableProps): JSX.Element {
  const { columns, data } = props;
  const {
    getTableProps, headerGroups, rows, prepareRow, getTableBodyProps,
  } = useTable({ columns, data }, useSortBy);
  return (
    <div>
      <Table {...getTableProps()}>
        <TableHead>
          {headerGroups.map((headerGroup) => (
            <TableRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <TableCell className='ct-header-cell' {...column.getHeaderProps(column.getSortByToggleProps())} style={{ width: column.width }}>
                  {' '}
                  <div className='header-content'>
                    {' '}
                    {column.render('Header')}

                    { column.isSorted
                      && column.isSortedDesc !== true
                      ? <ArrowUpwardIcon className='sort-icon' htmlColor='#66788A' fontSize='small' style={{ width: '1rem', height: '1rem', margin: '0 4px' }} />
                      : <ArrowDownwardIcon className='sort-icon' htmlColor='#66788A' fontSize='small' style={{ width: '1rem', height: '1rem', margin: '0 4px' }} />}
                    {' '}
                  </div>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <TableRow className='ct-table-body-row' {...row.getRowProps()}>
                {row.cells.map((cell) => <TableCell className='ct-body-cell' {...cell.getCellProps()}>{cell.render('Cell')}</TableCell>)}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

    </div>
  );
}
