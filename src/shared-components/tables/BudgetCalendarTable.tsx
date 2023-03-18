/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import {
  useTable,
  useSortBy,
} from 'react-table';
import {
  Table, TableHead, TableRow, TableBody, TableCell,
} from '@mui/material';
import './_bcTableStyles.scss';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import type { ITableProps } from 'formsTypes';
import type { IEvent } from 'admin/buildingSection/budget-calendar/types';

interface ITablePropsBC extends ITableProps {
  handleRowClick: (data: IEvent) => void;
}

export default function BudgetCalendarTable(props: ITablePropsBC): JSX.Element {
  const { columns, data, handleRowClick } = props;
  const {
    getTableProps, headerGroups, rows, prepareRow, getTableBodyProps,
  } = useTable({ columns, data }, useSortBy);
  return (
    <div className='bc-table-container'>
      <Table {...getTableProps()}>
        <TableHead>
          {headerGroups.map((headerGroup) => (
            <TableRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, index) => (
                <TableCell className={index === 0 ? 'bc-header-cell-first' : 'bc-header-cell'} {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {' '}
                  <div className='header-content'>
                    {' '}
                    {column.render('Header')}
                    {column.isSorted
                      ? column.isSortedDesc === true
                        ? <ArrowUpwardIcon className='sort-icon' htmlColor='#66788A' fontSize='small' style={{ width: '1rem', height: '1rem', margin: '0 4px' }} />
                        : <ArrowDownwardIcon className='sort-icon' htmlColor='#66788A' fontSize='small' style={{ width: '1rem', height: '1rem', margin: '0 4px' }} />
                      : ''}
                    {' '}
                  </div>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody {...getTableBodyProps()}>
          {rows.map((row): JSX.Element => {
            prepareRow(row);
            const { original } = row;
            const newOriginal: IEvent = {
              amount_budget: null,
              is_annual_budget_event: false,
              assignee: null,
              associative_key: '',
              final_cost: null,
              created_at: '',
              date: '',
              due_date: null,
              dayRangeType: '',
              description: null,
              durationType: '',
              endDate: null,
              event_end_date: null,
              event_start_date: null,
              file: null,
              gl: null,
              id: '',
              invitation_title: '',
              is_deleted: false,
              is_email_scheduled: false,
              is_rfp_form_link: false,
              month: null,
              occurrence: null,
              offer_availability: false,
              po_amount: null,
              po_id: null,
              po_status: null,
              priority: null,
              priority_index: null,
              reference_id: null,
              rfp_form: null,
              source_type: null,
              startDate: null,
              status: null,
              subject: null,
              tags: null,
              timeDuration: 0,
              title: '',
              track_email: false,
              unique_token: null,
              updated_at: '',
              user: 0,
              vendor: null,
              vendorEmail: '',
              ...original,
            };

            return (
              <TableRow className={original.status !== 4 ? 'bc-table-body-row' : 'bc-table-body-row-status-completed'} {...row.getRowProps()} onClick={(): void => { handleRowClick(newOriginal); }}>
                {row.cells.map((cell, cellIndex) => (
                  <TableCell className={cellIndex === 0 && original.status === 4 ? 'bc-body-cell-first bc-body-cell-first-status-completed' : cellIndex === 0 ? 'bc-body-cell-first' : 'bc-body-cell'} {...cell.getCellProps()}>
                    <div className='cell-content'>
                      {cell.render('Cell')}
                    </div>

                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

    </div>
  );
}
