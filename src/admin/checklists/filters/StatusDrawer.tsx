import React from 'react';
import Drawer from '@mui/material/Drawer';
import { Checkbox } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import _ from 'lodash';

interface IStatusDrawer {
  openStatusDrawer: boolean;
  setOpenStatusDrawer: (status: boolean) => void;
  statusList: number[];
  setStatusList: (moves: number[]) => void;
}
const optionsList = [
  {
    name: 'Not Started',
    id: 1,
    color: 'rgba(33, 33, 33, 0.6)',
    background: 'rgba(0, 0, 0, 0.08)',
  },
  {
    name: 'In Process',
    id: 2,
    color: 'rgba(33, 150, 243, 0.87)',
    background: 'rgba(33, 150, 243, 0.08)',
  },
  {
    name: 'Completed',
    id: 3,
    selected: false,
    label: 'Completed',
    color: '#4CAF50',
    background: 'rgba(76, 175, 80, 0.08)',
  },
  {
    name: 'Archive',
    id: 4,
    color: 'rgba(249, 168, 37, 0.87)',
    background: 'rgba(249, 168, 37, 0.08)',
  },
];

export default function StatusDrawer(props: IStatusDrawer): JSX.Element {
  const {
    openStatusDrawer, setOpenStatusDrawer, statusList, setStatusList,
  } = props;

  const handleChange = (changeId: number): void => {
    if (_.includes(statusList, changeId)) {
      const newIds = _.reject(statusList, (val: number) => val === changeId);
      setStatusList(newIds);
    } else {
      const newIds = [...statusList, changeId];
      setStatusList(newIds);
    }
  };

  return (
    <div>
      <Drawer
        anchor='bottom'
        open={openStatusDrawer}
        PaperProps={{ elevation: 0, style: { backgroundColor: 'transparent' } }}
      >
        <div className='filter-wrapper'>
          <div className='d-flex justify-space-between align-items-canter px-4'>
            <p className='cursor-pointer' aria-hidden='true' onClick={(): void => { setOpenStatusDrawer(false); }}><ArrowBackIcon /></p>
            <p className='heading'>Status</p>
            <p />
          </div>
          <div className='mt-4'>
            {optionsList.map((option) => (
              <div className='single-option border-bottom d-flex align-items-center pt-2 pb-2' key={option.name}>
                <Checkbox
                  checked={_.includes(statusList, option.id)}
                  onChange={(): void => {
                    handleChange(option.id);
                  }}
                />
                <div
                  style={{ background: option.background, color: option.color }}
                  // className='name-side-colored'
                  className='single-tag-global ms-3'
                >
                  <p>
                    {' '}
                    {option.name}
                    {' '}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Drawer>
    </div>
  );
}
