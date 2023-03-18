/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import AddIcon from '@mui/icons-material/Add';
import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { Tooltip, Typography } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useSnackbar } from 'notistack';
import StradaSpinner from 'shared-components/components/StradaSpinner';
import type { IAction } from 'admin/buildingSection/budget-calendar/types';
import { useSelector } from 'react-redux';
import type { RootState } from 'mainStore';
import Popover from '@mui/material/Popover';
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';
import StradaLoader from 'shared-components/components/StradaLoader';

export default function TaskAttachments({ action }: { action: IAction }): JSX.Element {
  const { task, data } = action;
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const currentTask = useSelector((state: RootState) => state.workspaces.sideSheetData.currentTask);

  const { mutate: uploadFile, isLoading } = useMutation(
    async (file: File) => {
      const formData = new FormData();
      if (action.task !== null) {
        formData.append('file', file);
        formData.append('filename', file.name);
        formData.append('task', String(currentTask?.id));
        formData.append('group', 'attachment');
      }

      return axios({
        url: '/api/budget-calendar/task-attachment/',
        method: 'POST',
        data: formData,
      });
    },
    {
      onSuccess: async (): Promise<void> => {
        await queryClient.invalidateQueries('get-single-task').then();
        await queryClient.invalidateQueries('get-single-task-data').then();
        await queryClient.invalidateQueries('prioritized-events').then();
        await queryClient.invalidateQueries('others-events').then();
        await queryClient.invalidateQueries('user-assigned-events').then();
        await queryClient.invalidateQueries('allevents/get-events').then();
        await queryClient.invalidateQueries('user-created-events').then();
        enqueueSnackbar('File uploaded successfully');
      },
    },
  );

  const { mutate: deleteAttachment, isLoading: deleting } = useMutation(async (id: number) => axios({
    url: `/api/budget-calendar/task-attachment/${id}/`,
    method: 'DELETE',
  }), {
    onSuccess: async (): Promise<void> => {
      await queryClient.invalidateQueries('get-single-task').then();
      await queryClient.invalidateQueries('get-single-task-data').then();
      await queryClient.invalidateQueries('user-assigned-events').then();
      await queryClient.invalidateQueries('prioritized-events').then();
      await queryClient.invalidateQueries('allevents/get-events').then();
      await queryClient.invalidateQueries('others-events').then();
      await queryClient.invalidateQueries('user-created-events').then();
      enqueueSnackbar('Attachment deleted successfully');
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files !== null && e.target.files.length !== 0) {
      uploadFile(e.target.files[0]);
    }
  };

  return (
    <div className='ss-attachments'>
      <StradaLoader open={deleting} message='Deleting' />
      <h6 className='side-sheet-side-label'> Attachments </h6>

      <div className='ss-attachment-list'>
        {currentTask?.attachments.map((attachment) => (
          <Tooltip title={attachment.filename}>
            <div
              className='attachment-card'
              // style={{
              //   marginRight:
              //     index + 1 === data.attachment.length
              //       ? '10px'
              //       : '200px',
              // }}
            >
              <div className='attachment-icon'>
                <DescriptionIcon htmlColor='rgba(33,33,33,0.6)' />
              </div>
              <div className='attachment-descrip'>
                {attachment.filename.length > 50
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                  ? `${attachment.filename.substring(0, 50)}...`
                  : attachment.filename}
              </div>
              <div className='attachment-chevron'>
                <PopupState variant='popover' popupId='demo-popup-popover'>
                  {(popupState): JSX.Element => (
                    <div>
                      <div {...bindTrigger(popupState)}>
                        <KeyboardArrowDownIcon fontSize='small' />
                      </div>
                      <Popover
                        {...bindPopover(popupState)}
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'center',
                        }}
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'center',
                        }}
                      >
                        <Typography sx={{ p: 2 }} className='attachment-popover-btn' onClick={(): void => { window.open(attachment.file, '_blank'); popupState.close(); }}> Download </Typography>
                        <Typography sx={{ p: 2 }} className='attachment-popover-btn' onClick={(): void => { deleteAttachment(attachment.id); popupState.close(); }}> Delete </Typography>
                      </Popover>
                    </div>
                  )}
                </PopupState>
              </div>
            </div>
          </Tooltip>
        ))}
        {isLoading && <StradaSpinner open={isLoading} message='Attachment is being upload' />}
        <div className='attachment-btn-wrapper'>
          <label htmlFor='ss-attachment-event'>
            <AddIcon />
          </label>
        </div>
      </div>

      <input
        type='file'
        id='ss-attachment-event'
        style={{ display: 'none' }}
        onChange={handleChange}
      />
    </div>
  );
}
