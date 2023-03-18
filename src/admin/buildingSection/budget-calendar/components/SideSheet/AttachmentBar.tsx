/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import AddIcon from '@mui/icons-material/Add';
import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { Tooltip } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useSnackbar } from 'notistack';
import Typography from '@mui/material/Typography';
import Popover from '@mui/material/Popover';
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';
import StradaSpinner from 'shared-components/components/StradaSpinner';
// import type { IEvent, ISideSheetData } from 'admin/buildingSection/budget-calendar/types';
import StradaLoader from 'shared-components/components/StradaLoader';
import { useSelector } from 'react-redux';
import type { RootState } from 'mainStore';

export default function TaskAttachments(): JSX.Element {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const singleSideSheetData = useSelector((state: RootState) => state.workspaces.sideSheetData.singleSideSheetData);
  const sideSheetData = useSelector((state: RootState) => state.workspaces.sideSheetData.sideSheetData);

  const { mutate: deleteAttachment, isLoading: deleting } = useMutation(async (id: number) => axios({
    url: `/api/budget-calendar/event-attachment/${id}/`,
    method: 'DELETE',
  }), {
    onSuccess: async (): Promise<void> => {
      await queryClient.invalidateQueries('get-single-sidesheet').then();
      await queryClient.invalidateQueries('user-assigned-events').then();
      await queryClient.invalidateQueries('prioritized-events').then();
      await queryClient.invalidateQueries('allevents/get-events').then();
      await queryClient.invalidateQueries('others-events').then();
      await queryClient.invalidateQueries('user-created-events').then();
      enqueueSnackbar('Attachment deleted successfully');
    },
  });

  const { mutate: uploadFile, isLoading: uploadingFile } = useMutation(
    async (file: File) => {
      const formData = new FormData();
      if (sideSheetData !== null) {
        formData.append('file', file);
        formData.append('filename', file.name);
        formData.append('event', String(sideSheetData.id));
        // formData.append('type', 'event');
        formData.append('group', 'attachment');
      }

      return axios({
        url: '/api/budget-calendar/event-attachment/',
        method: 'POST',
        data: formData,
      });
    },
    {
      onSuccess: async (): Promise<void> => {
        await queryClient.invalidateQueries('others-events').then();
        await queryClient.invalidateQueries('get-single-sidesheet').then();
        await queryClient.invalidateQueries('user-assigned-events').then();
        await queryClient.invalidateQueries('prioritized-events').then();
        await queryClient.invalidateQueries('allevents/get-events').then();
        await queryClient.invalidateQueries('user-created-events').then();
        enqueueSnackbar('File uploaded successfully');
      },
    },
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files !== null && e.target.files.length !== 0) {
      uploadFile(e.target.files[0]);
    }
  };

  return (
    <div className='ss-attachments' id='attachment-scroll-99'>
      <StradaLoader open={deleting} message='Deleting' />
      <h6 className='side-sheet-side-label'> Attachments </h6>

      <div className='ss-attachment-list'>

        {singleSideSheetData?.attachments && singleSideSheetData.attachments.map((attachment) => (
          <Tooltip title={attachment.filename}>
            <div
              className='attachment-card'
              // style={{
              //   marginRight:
              //     index + 1 === singleSideSheetData.attachment.length
              //       ? '10px'
              //       : '200px',
              // }}
            >
              <div className='attachment-icon'>
                <DescriptionIcon htmlColor='rgba(33,33,33,0.6)' />
              </div>
              <div className='attachment-descrip'>
                {attachment.filename.length > 50
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
        <StradaSpinner open={uploadingFile} message='Uploading File' />
        <label htmlFor='ss-attachment-event'>
          <div className='attachment-btn-wrapper'>
            <AddIcon />
          </div>
        </label>
      </div>

      <input
        type='file'
        multiple={false}
        id='ss-attachment-event'
        style={{ display: 'none' }}
        onChange={handleChange}
      />
    </div>
  );
}
