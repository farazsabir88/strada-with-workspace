/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import type { OptionProps, StylesConfig } from 'react-select';
import Select from 'react-select';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import CloseIcon from '@mui/icons-material/Close';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { IconButton } from '@mui/material';
import { useSelector } from 'react-redux';
import type { RootState } from 'mainStore';
import OccuranceDialog from './OccuranceDialog';

interface IOccuranceProps {
  name: string;
  value: number;
}

const allOccurance: IOccuranceProps[] = [
  {
    name: 'Monthly',
    value: 1,
  },
  {
    name: 'Semi-Annual',
    value: 2,
  },
  {
    name: 'Quarterly',
    value: 3,
  },
  {
    name: 'Non-recurring',
    value: 4,
  },
];

const selectStyles: StylesConfig<IOccuranceProps> = {
  control: () => ({
    border: 'none',
    width: '100%',
    display: 'flex',
    borderRadius: '4px',
  }),
  valueContainer: () => ({
    height: '40px',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
  }),
  singleValue: () => ({
    color: 'rgba(33, 33, 33, 0.6)',
    fontSize: '14px',
  }),
  // input: () => ({
  //   width: '100%',
  // }),
};

export default function OccuranceBar(): JSX.Element {
  const [selectedCode, setSelectedCode] = React.useState<IOccuranceProps | null>(null);
  const [open, setOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  const singleSideSheetData = useSelector((state: RootState) => state.workspaces.sideSheetData.singleSideSheetData);

  const getSelectedCode = (): void => {
    if (singleSideSheetData !== null) {
      if (singleSideSheetData.occurrence !== null) {
        setSelectedCode(allOccurance.filter((occ) => occ.value === singleSideSheetData.occurrence)[0]);
      } else {
        setSelectedCode(null);
      }
    } else {
      setSelectedCode(null);
    }
  };

  const handleClose = (): void => {
    getSelectedCode();
    setOpen(false);
  };

  useEffect(() => {
    getSelectedCode();
  }, [singleSideSheetData]);

  function SelectCustomOption(option: OptionProps<IOccuranceProps>): JSX.Element {
    const { data } = option;
    return (
      <div className='select-custom-option' onClick={(): void => { setSelectedCode(data); setOpen(true); }} aria-hidden='true'>
        {data.name}
      </div>
    );
  }

  function ClearIndicator(): JSX.Element {
    return (
      <IconButton onClick={(): void => { setOpen(false); }}>
        <CloseIcon fontSize='small' />
      </IconButton>
    );
  }
  function DownChevron(): JSX.Element {
    return (
      <div>
        <ArrowDropDownIcon fontSize='small' />
      </div>
    );
  }
  return (
    <div className='assignee-sheet-bar'>
      <OccuranceDialog open={open} handleClose={handleClose} occurance={selectedCode !== null && selectedCode !== undefined ? selectedCode.value : null} sideSheetData={singleSideSheetData} />
      <h6 className='side-sheet-side-label'> Occurrence </h6>
      <div className='assignee-sheet-popover'>
        <div className='popover-btn' aria-hidden='true'>
          <Select
            className='single-select'
            options={[...allOccurance]}
            value={selectedCode}
            placeholder={<HorizontalRuleIcon />}
            isClearable
            closeMenuOnSelect
            styles={selectStyles}
            getOptionLabel={(val): string => val.name}
            components={{
              Option: SelectCustomOption,
              ClearIndicator,
              DropdownIndicator: selectedCode === null ? DownChevron : null,
              IndicatorSeparator: null,
            }}
          />
        </div>

      </div>
    </div>
  );
}
