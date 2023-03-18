import React, { useState, useEffect } from 'react';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import CancelIcon from '@mui/icons-material/Cancel';
import moment from 'moment';
import type { IFilterButton, IOption } from '../types';

export default function FilterButton(props: IFilterButton): JSX.Element {
  const {
    text, onClick, options, selectedOptions, resetSelected, startDate, endDate, taskCompletedType, taskCompletedValue,
  } = props;

  const [selectedList, setSelectedList] = useState<IOption[] | string>([]);

  const handleFilter = (): void => {
    const filteredList = options?.filter((option: IOption) => selectedOptions?.includes(option.id as never));
    if (typeof filteredList !== 'string' && filteredList) setSelectedList(filteredList);
  };
  const handleCreatedFilter = (): void => {
    const filteredList = `${moment(startDate).format('MMMM DD,YYYY')}-${moment(endDate).format('MMMM DD,YYYY')}`;
    setSelectedList(filteredList);
  };
  const handleTaskCompletedFilter = (): void => {
    let completedType = '';
    if (String(taskCompletedType) === '0') {
      completedType = 'is equal';
    } else if (String(taskCompletedType) === '1') {
      completedType = 'is greater';
    } else if (String(taskCompletedType) === '2') {
      completedType = 'is less';
    } else if (String(taskCompletedType) === '3') {
      completedType = 'greater or equal';
    } else if (String(taskCompletedType) === '4') {
      completedType = 'less or equal';
    }
    const filteredList = `Task Completed:${completedType} ${taskCompletedValue}`;
    setSelectedList(filteredList);
  };

  useEffect(() => {
    if (startDate !== undefined && endDate !== undefined) {
      handleCreatedFilter();
    } else if (taskCompletedType !== '' && taskCompletedValue !== undefined) {
      handleTaskCompletedFilter();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate, taskCompletedType, taskCompletedValue]);
  useEffect(() => {
    handleFilter();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options, selectedOptions]);
  return (
    <div className={(startDate !== undefined && endDate !== undefined) || (taskCompletedValue !== undefined && taskCompletedType !== '') || (selectedList.length > 0 && typeof selectedList !== 'string') ? 'bc-filter-btn-active' : 'bc-filter-btn'} onClick={onClick} aria-hidden='true'>
      <p>
        {(startDate !== undefined && endDate !== undefined) || (taskCompletedType !== '' && taskCompletedValue !== undefined)
          ? selectedList
          : (
            <>
              {' '}
              {text}
              {' '}
              {typeof selectedList !== 'string' && selectedList.length > 0 && (selectedList[0].name !== undefined && `:${selectedList[0].name}`)}
              {typeof selectedList !== 'string' && selectedList.length > 1 && `(+${selectedList.length - 1})`}
              {' '}
            </>
          )}
      </p>
      {(startDate !== undefined && endDate !== undefined) || (taskCompletedValue !== undefined && taskCompletedType !== '') || (selectedList.length > 0 && typeof selectedList !== 'string') ? <div onClick={resetSelected} aria-hidden='true'><CancelIcon style={{ color: 'rgba(33,33,33,.6)', cursor: 'pointer' }} fontSize='small' /></div> : <KeyboardArrowDown />}
    </div>
  );
}
