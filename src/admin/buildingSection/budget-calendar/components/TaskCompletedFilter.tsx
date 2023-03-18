import {
  Popover,
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import type { ITaskCompletedFilters } from 'admin/checklists/types';
import SelectInput from 'shared-components/inputs/SelectInput';
import InputField from 'shared-components/inputs/InputField';
import type { SelectChangeEvent } from '@mui/material/Select';
import FilterButton from './FilterButton';

export default function TaskCompletedFilter(props: ITaskCompletedFilters): JSX.Element {
  const {
    taskCompletedType,
    setTaskCompletedType,
    taskCompletedValue,
    setTaskCompletedValue,
  } = props;

  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const [completedType, setCompletedType] = useState<string>('');
  const [completedValue, setCompletedValue] = useState<number | undefined>();

  useEffect(() => {
    if (completedType !== '' && completedValue !== undefined) {
      setTaskCompletedType(completedType);
      setTaskCompletedValue(completedValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completedType, completedValue]);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const resetSelected = (): void => {
    setTaskCompletedType('');
    setTaskCompletedValue(undefined);
    setCompletedType('');
    setCompletedValue(undefined);
  };

  return (
    <div>
      <FilterButton text='Task Completed' onClick={handleClick} taskCompletedType={taskCompletedType} taskCompletedValue={taskCompletedValue} resetSelected={resetSelected} />
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <div style={{ width: '200px', padding: '15px 15px 0 15px' }}>
          <SelectInput
            value={completedType !== '' ? JSON.stringify(completedType) : ''}
            name='name'
            label='Select...'
            onChange={(obj: SelectChangeEvent): void => { setCompletedType(obj.target.value); }}
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
              onChange={(event: React.ChangeEvent<HTMLInputElement>): void => { setCompletedValue(Number(event.target.value)); }}
              value={completedValue}
            />
          </div>
        </div>

      </Popover>
    </div>
  );
}
