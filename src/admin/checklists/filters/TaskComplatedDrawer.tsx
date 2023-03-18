import React from 'react';
import Drawer from '@mui/material/Drawer';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SelectInput from 'shared-components/inputs/SelectInput';
import InputField from 'shared-components/inputs/InputField';
import type { SelectChangeEvent } from '@mui/material/Select';

interface ITaskCompletedDrawer {
  openTaskCompletedDrawer: boolean;
  setOpenTaskCompletedDrawer: (dueDate: boolean) => void;
  drawerTaskCompletedType: string;
  setDrawerTaskCompletedType: (type: string) => void;
  drawerTaskCompletedValue: number | undefined;
  setDrawerTaskCompletedValue: (value: number | undefined) => void;
}

export default function TaskCompletedDrawer(props: ITaskCompletedDrawer): JSX.Element {
  const {
    openTaskCompletedDrawer, setOpenTaskCompletedDrawer, drawerTaskCompletedType, setDrawerTaskCompletedType, drawerTaskCompletedValue, setDrawerTaskCompletedValue,
  } = props;

  return (
    <div>
      <Drawer
        anchor='bottom'
        open={openTaskCompletedDrawer}
        PaperProps={{ elevation: 0, style: { backgroundColor: 'transparent' } }}
      >
        <div className='filter-wrapper'>
          <div className='d-flex justify-space-between align-items-canter px-4'>
            <p className='cursor-pointer' aria-hidden='true' onClick={(): void => { setOpenTaskCompletedDrawer(false); }}><ArrowBackIcon /></p>
            <p className='heading'>Task Completed</p>
            <p className='btn-txt cursor-pointer' aria-hidden='true' onClick={(): void => { setOpenTaskCompletedDrawer(false); }}>Done</p>
          </div>
          <div className='mt-3' style={{ padding: '15px 15px 0 15px' }}>
            <SelectInput
              value={drawerTaskCompletedType !== '' ? JSON.stringify(drawerTaskCompletedType) : ''}
              name='name'
              label='Select...'
              onChange={(obj: SelectChangeEvent): void => { setDrawerTaskCompletedType(obj.target.value); }}
              options={[{ name: 'is equal', value: 0 }, { name: 'is greater', value: 1 }, { name: 'is less', value: 2 }, { name: 'greater or equal', value: 3 }, { name: 'less or equal', value: 4 }]}
              defaultValue='true'
              showPleaseSelect={false}
            />
            <div>
              <InputField
                id='template_value'
                name='name'
                type='number'
                label='Task Count'
                onChange={(event: React.ChangeEvent<HTMLInputElement>): void => { setDrawerTaskCompletedValue(Number(event.target.value)); }}
                value={drawerTaskCompletedValue}
              />
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  );
}
