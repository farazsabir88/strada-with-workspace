/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import _ from 'lodash';
import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import SecondaryButton from 'shared-components/components/SecondaryButton';
import type { ISideSheetData } from 'admin/buildingSection/budget-calendar/types';

interface IDialogProps {
  open: boolean;
  handleClose: () => void;
  occurance: number | null;
  sideSheetData: ISideSheetData | null;
}

interface IDialogText {
  id: number;
  heading: string;
  subHeading: string;
  maxSelection: number;
}

interface IVendorProps {
  name: string;
  value: number;
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

const monthsArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const dialogTexts: IDialogText[] = [
  {
    id: 1,
    heading: 'Change occurrence to monthly',
    subHeading: 'Changing occurrence to monthly will create additional events for each month.',
    maxSelection: 0,
  },
  {
    id: 2,
    heading: 'Change occurrence to semi-annual',
    subHeading: 'Select the other month that this event exists. This will create additional events in these months.',
    maxSelection: 1,
  },
  {
    id: 3,
    heading: 'Change occurrence to quarterly',
    subHeading: 'Select the other month that this event exists. This will create additional events in these months.',
    maxSelection: 3,
  },
  {
    id: 4,
    heading: 'Change occurrence to non-recurring',
    subHeading: '',
    maxSelection: 0,
  },
];

export default function OccuranceDialog({
  open, handleClose, occurance, sideSheetData,
}: IDialogProps): JSX.Element {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const [currentOccurance, setCurrentOccurance] = useState<IDialogText | null>(null);
  const [selectedMonths, setSelectedMonths] = useState<number[]>([]);

  useEffect(() => {
    if (open && occurance !== null) {
      const co = dialogTexts.filter((obj) => obj.id === occurance);
      setCurrentOccurance(co[0]);
    }
  }, [occurance, open]);

  const handleMonthSelect = (monthId: number): void => {
    if (currentOccurance === null) {
      return;
    }
    if (_.includes(selectedMonths, monthId)) {
      const newMonths = _.reject(selectedMonths, (id) => id === monthId);
      setSelectedMonths(newMonths);
    } else if (!(selectedMonths.length >= currentOccurance.maxSelection)) {
      setSelectedMonths([...selectedMonths, monthId]);
    }
  };

  const onDialogClose = (): void => {
    setCurrentOccurance(null);
    setSelectedMonths([]);
    handleClose();
  };

  const { mutate: updateOccurrence, isLoading: updatingOccurance } = useMutation(async (monthArray: number[]) => axios({
    url: `/api/budget-calendar/event/${sideSheetData?.id}/`,
    method: 'PATCH',
    data: {
      months: monthArray,
      occurrence: occurance,
    },
  }), {
    onSuccess: async (): Promise<void> => {
      onDialogClose();
      await queryClient.invalidateQueries('others-events').then();
      await queryClient.invalidateQueries('sidesheet/get-events').then();
      await queryClient.invalidateQueries('get-single-sidesheet').then();
      await queryClient.invalidateQueries('prioritized-events').then();
      await queryClient.invalidateQueries('user-assigned-events').then();
      await queryClient.invalidateQueries('allevents/get-events').then();
      await queryClient.invalidateQueries('user-created-events').then();
      enqueueSnackbar('Occurrence changed successfully');
    },
  });

  const handleOccuranceChange = (): void => {
    if (currentOccurance === null || occurance === null) {
      return;
    }
    if (currentOccurance.id === 1) {
      const content = monthsArray.filter((mon) => sideSheetData?.month !== mon);
      setSelectedMonths(content);
      updateOccurrence(content);
    } else if (currentOccurance.id === 4) {
      updateOccurrence([]);
    } else {
      updateOccurrence(selectedMonths);
    }
  };

  const isDisabled = (): boolean => {
    if (occurance === 1) {
      return false;
    } if (occurance === 2 && selectedMonths.length < 1) {
      return true;
    } if (occurance === 2 && selectedMonths.length === 1) {
      return false;
    } if (occurance === 3 && selectedMonths.length < 3) {
      return true;
    } if (occurance === 3 && selectedMonths.length === 3) {
      return false;
    } if (occurance === 4) {
      return false;
    }
    return true;
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={onDialogClose}
        fullWidth
        maxWidth='sm'
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>
          <h3 className='dialog-heading'>
            {' '}
            {currentOccurance?.heading}
            {' '}
          </h3>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            <h6>
              {' '}
              {currentOccurance?.subHeading}
              {' '}
            </h6>
          </DialogContentText>

          {!_.includes([1, 4], currentOccurance?.id) && (
            <>
              <div className='sidesheet-months-wrapper'>
                {allMonths.map((month) => (
                  <div
                    key={month.name}
                    className={month.value !== sideSheetData?.month ? _.includes(selectedMonths, month.value) ? 'month-style active' : 'month-style' : 'month-style disable'}
                    onClick={(): void => {
                      month.value !== sideSheetData?.month && handleMonthSelect(month.value);
                    }}
                    aria-hidden='true'
                  >
                    {month.name}
                  </div>
                ))}
              </div>
              <div className='month-indecator'>
                {selectedMonths.length}
                /
                {' '}
                {currentOccurance?.maxSelection}
                {' '}
                months
              </div>
            </>
          )}

        </DialogContent>
        <DialogActions>
          <SecondaryButton className='secondary-btn-secondary' onClick={onDialogClose}>Cancel</SecondaryButton>
          <SecondaryButton className='secondary-diloag-btn' disabled={isDisabled() || updatingOccurance} onClick={(): void => { handleOccuranceChange(); }}>Change</SecondaryButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}
