import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import type { ISortBy } from './types';

interface ISortingDrawer {
  openSortDrawer: boolean;
  setOpenSortDrawer: (status: boolean) => void;
  ascendingSort: boolean;
  setAscendingSort: (status: boolean) => void;
  sortBy: ISortBy;
  setSortBy: (status: ISortBy) => void;
}

const SortingList = [
  {
    value: 'name',
    label: 'Name',
  },
  {
    value: 'building',
    label: 'Property',
  },
  {
    value: 'assignees',
    label: 'Assignees',
  },
  {
    value: 'task_completed',
    label: 'Task Completed',
  },
  {
    value: 'due_date',
    label: 'Due',
  },
  {
    value: 'last_activity',
    label: 'Last Activity',
  },
  {
    value: 'status',
    label: 'Status',
  },
];

export default function SortingDrawer(props: ISortingDrawer): JSX.Element {
  const {
    openSortDrawer, setOpenSortDrawer, ascendingSort, setAscendingSort, sortBy, setSortBy,
  } = props;

  const handleClick = (item: ISortBy): void => {
    if (item.value === sortBy.value) {
      setAscendingSort(!ascendingSort);
    } else {
      setSortBy(item);
      setAscendingSort(true);
    }
  };

  return (
    <div>
      <Drawer
        anchor='bottom'
        open={openSortDrawer}
        onClose={(): void => { setOpenSortDrawer(false); }}
        PaperProps={{ elevation: 0, style: { backgroundColor: 'transparent' } }}
      >
        <div className='sorting-wrapper'>
          <p className='heading'>Sort</p>
          <div className='mt-4'>
            {SortingList.map((item) => (
              <div className='sort-item'>
                <div className='sort-icon'>
                  {ascendingSort ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
                </div>
                <p aria-hidden='true' onClick={(): void => { handleClick(item); }}>{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </Drawer>
    </div>
  );
}
