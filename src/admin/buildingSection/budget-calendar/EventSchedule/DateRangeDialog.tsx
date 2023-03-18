import { Dialog, DialogContent } from '@mui/material';
import moment from 'moment';
import { DateRangePicker } from 'react-date-range';
import React from 'react';

interface IDateRangeDialog {
  open: boolean;
  handleClose: () => void;
  startDate: string;
  endDate: string;
  setRanges: (_startDate: string, _endDate: string) => void;
}

const convertDateToUTC = (date: Date): Date => new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());

export default function DateRangeDialog(props: IDateRangeDialog): JSX.Element {
  const {
    open, handleClose, startDate, endDate, setRanges,
  } = props;
  return (
    <div>
      <Dialog
        open={open}
        keepMounted
        onClose={handleClose}
        aria-labelledby='alert-dialog-slide-title'
        aria-describedby='alert-dialog-slide-description'
      >
        <DialogContent>
          <DateRangePicker
            minDate={moment().toDate()}
            className='schedule-range-picker'
            ranges={[{
              startDate: startDate ? convertDateToUTC(new Date(startDate)) : convertDateToUTC(new Date()),
              endDate: endDate ? convertDateToUTC(new Date(endDate)) : convertDateToUTC(new Date()),
              key: 'selection',
            }]}
            onChange={(ranges): void => {
              setRanges(moment(ranges.selection.startDate).format('YYYY-MM-DD'), moment(ranges.selection.endDate).format('YYYY-MM-DD'));
            }}
            showMonthArrow={false}
            showDateDisplay={false}
            weekdayDisplayFormat='EEEEE'
            dayDisplayFormat='d'
            color='#00CFA1'
            rangeColors={['rgba(0, 207, 161, 0.3)']}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
