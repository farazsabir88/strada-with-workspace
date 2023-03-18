import React, { useEffect } from 'react';
import type { OptionProps, StylesConfig } from 'react-select';
import Select from 'react-select';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import CloseIcon from '@mui/icons-material/Close';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { IconButton } from '@mui/material';
import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import StradaSpinner from 'shared-components/components/StradaSpinner';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from 'mainStore';
import { setMonthChange } from 'admin/store/SideSheetData';

interface IVendorProps {
  name: string;
  value: number | string;
}

const allMonths: IVendorProps[] = [
  {
    name: 'January',
    value: 1,
  },
  {
    name: 'February',
    value: 2,
  },
  {
    name: 'March',
    value: 3,
  },
  {
    name: 'April',
    value: 4,
  },
  {
    name: 'May',
    value: 5,
  },
  {
    name: 'June',
    value: 6,
  },
  {
    name: 'July',
    value: 7,
  },
  {
    name: 'August',
    value: 8,
  },
  {
    name: 'September',
    value: 9,
  },
  {
    name: 'October',
    value: 10,
  },
  {
    name: 'November',
    value: 11,
  },
  {
    name: 'December',
    value: 12,
  },
];

const selectStyles: StylesConfig<IVendorProps> = {
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
};

export default function MonthBar(): JSX.Element {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const sideSheetData = useSelector((state: RootState) => state.workspaces.sideSheetData.sideSheetData);

  const [selectedCode, setSelectedCode] = React.useState<IVendorProps | null>(null);
  const [open, setOpen] = React.useState(false);
  useEffect(() => {
    if (sideSheetData !== null) {
      if (sideSheetData.month !== null) {
        setSelectedCode(allMonths.filter((mo) => mo.value === sideSheetData.month)[0]);
      } else {
        setSelectedCode(null);
      }
    }
  }, [sideSheetData]);

  const { mutate: updateMonth, isLoading: updatingMonth } = useMutation(async (monthToUpdate: number | string | null) => axios({
    url: `/api/budget-calendar/event/${sideSheetData?.id}/`,
    method: 'PATCH',
    data: {
      month: monthToUpdate,
    },

  }), {
    onSuccess: async (): Promise<void> => {
      dispatch(setMonthChange(true));
      await queryClient.invalidateQueries('get-single-sidesheet').then();
      await queryClient.invalidateQueries('others-events').then();
      await queryClient.invalidateQueries('sidesheet/get-events').then();
      await queryClient.invalidateQueries('prioritized-events').then();
      await queryClient.invalidateQueries('user-assigned-events').then();
      await queryClient.invalidateQueries('allevents/get-events').then();
      await queryClient.invalidateQueries('user-created-events').then();
      enqueueSnackbar('Month of event updated successfully');
    },
    // onError: async (): Promise<void> => {
    //   await queryClient.invalidateQueries('others-events').then();
    //   await queryClient.invalidateQueries('sidesheet/get-events').then();
    //   await queryClient.invalidateQueries('user-assigned-events').then();
    //   await queryClient.invalidateQueries('prioritized-events').then();
    //   await queryClient.invalidateQueries('allevents/get-events').then();
    //   await queryClient.invalidateQueries('user-created-events').then();
    // },
  });

  function SelectCustomOption(option: OptionProps<IVendorProps>): JSX.Element {
    const { data } = option;

    return (
      <div className='select-custom-option' onClick={(): void => { updateMonth(data.value); setOpen(false); setSelectedCode(allMonths.filter((mo) => mo.value === data.value)[0]); }} aria-hidden='true'>
        {data.name}
      </div>
    );
  }

  function ClearIndicator(): JSX.Element {
    return (
      <IconButton onClick={(): void => { setOpen(false); }}>
        <CloseIcon fontSize='small' />
      </IconButton>
    // <>
    //   {open && (
    //     <IconButton onClick={(): void => { setOpen(false); }}>
    //       <CloseIcon fontSize='small' />
    //     </IconButton>
    //   )}
    //   {
    //     !open && <div />
    //   }
    // </>
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
      <h6 className='side-sheet-side-label'> Month</h6>
      <div className='assignee-sheet-popover'>
        <div className='popover-btn' aria-hidden='true'>
          {updatingMonth ? <StradaSpinner open={updatingMonth} message='Updating' /> : (
            <Select
              className='single-select'
              options={[...allMonths]}
              value={selectedCode}
              placeholder={<HorizontalRuleIcon />}
              isClearable
              closeMenuOnSelect
              styles={selectStyles}
              menuIsOpen={open}
              onMenuOpen={(): void => { setOpen(true); }}
              getOptionLabel={(val): string => val.name}
              components={{
                Option: SelectCustomOption,
                ClearIndicator,
                DropdownIndicator: selectedCode === null ? DownChevron : null,
                IndicatorSeparator: null,
              }}
            />
          ) }

        </div>

      </div>
    </div>
  );
}
