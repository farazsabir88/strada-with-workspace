/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {
  Avatar, Divider, ListItem, ListItemText,
} from '@mui/material';
import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import SecondaryButton from 'shared-components/components/SecondaryButton';
import StradaSpinner from 'shared-components/components/StradaSpinner';
import type { IEvent, IDetail } from 'admin/buildingSection/budget-calendar/types';

interface IDialogProps {
  open: boolean;
  handleClose: () => void;
  selectedTemplate: IDetail | null;
  sideSheetData: IEvent | null;
}

export default function TaskTemplateDialog(props: IDialogProps): JSX.Element {
  const {
    open, handleClose, selectedTemplate, sideSheetData,
  } = props;
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const { mutate: createTask, isLoading } = useMutation(async () => axios({
    url: '/api/budget-calendar/task/add_multiple_task/',
    method: 'POST',
    data: {
      event: sideSheetData?.id,
      task_list: selectedTemplate?.tasks,
      template_name: selectedTemplate?.template_name,
    },
  }), {
    onSuccess: async (): Promise<void> => {
      await queryClient.invalidateQueries('get-single-sidesheet').then();
      enqueueSnackbar('Task added successfully');
      handleClose();
    },
  });

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        className='dialog-side-sheet'
        // fullWidth
        // maxWidth='sm'
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        classes={{
          paper: 'task-temp-dialog',
        }}
      >
        <DialogTitle id='alert-dialog-title'>
          <h3 className='dialog-heading'>
            {' '}
            Tasks From
            {' '}
            {selectedTemplate?.template_name}
            {' '}
          </h3>
        </DialogTitle>
        <Divider />
        <DialogContent>
          {selectedTemplate?.tasks.map((task) => (
            <ListItem
              button
              divider
              aria-controls='ringtone-menu'
              aria-label='phone ringtone'
              role='listitem'
            >
              <ListItemText primary={task.name} style={{ flex: '2 1 !important' }} className='text-break' />
              <div className='table-cell-wrapper image-align'>
                <Avatar className='avatar' src={task.assignee_image !== '' ? `${process.env.REACT_APP_IMAGE_URL}${task.assignee_image}` : ''} />
                <span style={{ paddingLeft: '16px' }}>
                  {task.assignee_name ? task.assignee_name : 'No Assignee'}
                </span>
              </div>
            </ListItem>
          ))}
        </DialogContent>
        <Divider />
        <DialogActions>
          <SecondaryButton className='secondary-btn-secondary' onClick={handleClose}>Cancel</SecondaryButton>
          {isLoading ? <StradaSpinner open={isLoading} message='Tasks are being created' size={24} /> : <SecondaryButton className='secondary-diloag-btn' onClick={(): void => { createTask(); }}>Add</SecondaryButton>}
        </DialogActions>
      </Dialog>
    </div>
  );
}
