import React from 'react';
import Drawer from '@mui/material/Drawer';
import { Avatar, Checkbox } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import _ from 'lodash';

interface IOptions {
  name: string;
  value: number;
  avatar?: string | null;
}

interface CustomDrawer {
  openCustomDrawer: boolean;
  setOpenCustomDrawer: (status: boolean) => void;
  selectedList: number[];
  setSelectedList: (building: number[]) => void;
  optionsList: IOptions[];
  customDrawerName: string;
}

export default function BuildingDrawer(props: CustomDrawer): JSX.Element {
  const {
    openCustomDrawer, setOpenCustomDrawer, selectedList, setSelectedList, optionsList, customDrawerName,
  } = props;

  const handleChange = (changeId: number): void => {
    if (_.includes(selectedList, changeId)) {
      const newIds = _.reject(selectedList, (val: number) => val === changeId);
      setSelectedList(newIds);
    } else {
      const newIds = [...selectedList, changeId];
      setSelectedList(newIds);
    }
  };

  return (
    <div>
      <Drawer
        anchor='bottom'
        open={openCustomDrawer}
        PaperProps={{ elevation: 0, style: { backgroundColor: 'transparent' } }}
      >
        <div className='filter-wrapper'>
          <div className='d-flex justify-space-between align-items-canter px-4'>
            <p className='cursor-pointer' aria-hidden='true' onClick={(): void => { setOpenCustomDrawer(false); }}><ArrowBackIcon /></p>
            <p className='heading'>{customDrawerName}</p>
            <p />
          </div>
          <div className='mt-4'>
            {optionsList.map((option) => (
              <div className='single-option border-bottom d-flex align-items-center pt-2 pb-2' key={option.name}>
                <Checkbox
                  checked={_.includes(selectedList, option.value)}
                  onChange={(): void => {
                    handleChange(option.value);
                  }}
                />
                <div
                  // className='name-side-colored'
                  className='ms-3 d-flex align-items-center'
                >
                  {(option.avatar !== undefined)
                  && (
                    <div className='me-2'>
                      <Avatar src={`${process.env.REACT_APP_IMAGE_URL}${option.avatar}`} style={{ width: '24px', height: '24px' }}>
                        {option.name}
                      </Avatar>
                    </div>
                  )}
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
