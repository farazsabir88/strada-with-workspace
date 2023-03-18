/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-floating-promises */
import React, { useEffect, useState } from 'react';
import InputBase from '@mui/material/InputBase';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DialogTitle from '@mui/material/DialogTitle';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSnackbar } from 'notistack';
import StradaLoader from 'shared-components/components/StradaLoader';
import type { IVendorListing } from 'admin/purchaseOrder/types';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from 'mainStore';
import { setTaskIntoFocus } from 'admin/store/SideSheetData';
import EmailReminderDialog from './EmailReminderDialog';

export default function SideSheetHeader({
  dialogClose,
  isFullScreen,
  setIsFullScreen,

}: {
  dialogClose: () => void;
  isFullScreen: boolean;
  setIsFullScreen: (status: boolean) => void;

}): JSX.Element {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [val, setVal] = useState<string>('');
  const [openEmailReminderDialog, setOpenEmailReminderDialog] = useState(false);
  const urlString = window.location.href; // window.location.href
  const url = new URL(urlString);
  const urlEventId = url.searchParams.get('eventId');
  const dispatch = useDispatch();
  const [purchaseOrdersData, setPurchaseOrdersData] = useState<IVendorListing | undefined>();
  // const sideSheetData = useSelector((state: RootState) => state.workspaces.sideSheetData.sideSheetData);
  const singleSideSheetData = useSelector((state: RootState) => state.workspaces.sideSheetData.singleSideSheetData);

  useEffect(() => {
    if (singleSideSheetData !== null) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      setVal(singleSideSheetData.title);
    }
  }, [singleSideSheetData]);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null,
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };

  const handleCloseSideSheet = (): void => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (urlEventId !== null) {
      navigate('/workspace/budget-calendar');
    }
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const { mutate: upadteTitle } = useMutation(
    async () => axios({
      url: `/api/budget-calendar/event/${singleSideSheetData?.id}/`,
      method: 'PATCH',
      data: {
        title: val,
      },
    }),
    {
      onSuccess: async (): Promise<void> => {
        await queryClient.invalidateQueries('others-events').then();
        await queryClient.invalidateQueries('sidesheet/get-events').then();
        await queryClient.invalidateQueries('prioritized-events').then();
        await queryClient.invalidateQueries('user-assigned-events').then();
        await queryClient.invalidateQueries('allevents/get-events').then();
        await queryClient.invalidateQueries('user-created-events').then();
      },
    },
  );
  const { mutate: deleteEvent, isLoading: doingUndo } = useMutation(
    async (status: boolean) => axios({
      url: `/api/budget-calendar/event/${singleSideSheetData?.id}/`,
      method: 'PATCH',
      data: {
        is_deleted: status,
      },
    }),
    {
      onSuccess: async (): Promise<void> => {
        await queryClient.invalidateQueries('others-events').then();
        await queryClient.invalidateQueries('sidesheet/get-events').then();
        await queryClient.invalidateQueries('get-single-sidesheet').then();
        await queryClient.invalidateQueries('prioritized-events').then();
        await queryClient.invalidateQueries('user-assigned-events').then();
        await queryClient.invalidateQueries('allevents/get-events').then();
        await queryClient.invalidateQueries('user-created-events').then();
      },
    },
  );
  const { mutate: deletePermanantely, isLoading: deletingPermanantly } = useMutation(
    async () => axios({
      url: `/api/budget-calendar/event/${singleSideSheetData?.id}/`,
      method: 'DELETE',
    }),
    {
      onSuccess: async (): Promise<void> => {
        await queryClient.invalidateQueries('others-events').then();
        handleCloseSideSheet();
        await queryClient.invalidateQueries('sidesheet/get-events').then();
        await queryClient.invalidateQueries('prioritized-events').then();
        await queryClient.invalidateQueries('user-assigned-events').then();
        await queryClient.invalidateQueries('allevents/get-events').then();
        await queryClient.invalidateQueries('user-created-events').then();
        dialogClose();
      },
    },
  );

  const handleKeyPress = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter') {
      upadteTitle();
    }
  };
  const handleBlur = (): void => {
    upadteTitle();
  };

  const handleExportButton = (): void => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (singleSideSheetData?.building !== null) {
      navigate(
        `/workspace/new-purchase-order/${singleSideSheetData?.id}`,
      );
    } else {
      enqueueSnackbar('Please select a building to use this functionality');
    }
  };

  useQuery(
    ['get-PO-by-id', singleSideSheetData?.po_id],
    async () => axios({
      url: `api/purchase-orders/${singleSideSheetData?.po_id}`,
      method: 'GET',
    }),
    {
      onSuccess: (res) => {
        const datas: IVendorListing = res.data;
        setPurchaseOrdersData(datas);
      },
      enabled: !(singleSideSheetData?.po_id == null),
    },
  );

  const { mutate: updateStatus } = useMutation(async ({ closed, po_id }: { closed: boolean; po_id: number | null | undefined }) => axios({
    url: `api/purchase-orders/${po_id}/`,
    method: 'PATCH',
    data: { closed },
  }), {
    onSuccess: async () => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      await queryClient.invalidateQueries('get-PO-by-id').catch()
        .then();
    },

  });

  const handleChangeStatus = (): void => {
    updateStatus({ closed: true, po_id: singleSideSheetData?.po_id });
  };
  return (
    <>
      <DialogTitle className='bc-sh-title-bar'>
        <StradaLoader
          open={doingUndo || deletingPermanantly}
          message='Action in progress'
        />
        {Boolean(singleSideSheetData?.is_deleted) && (
          <div className='deleted-event-controls'>
            <div className='left-side'>
              <IconButton>
                <DeleteIcon htmlColor='#c62828' />
              </IconButton>
              <p> This event was deleted</p>
            </div>
            <div className='right-side'>
              <h6
                onClick={(): void => {
                  deleteEvent(false);
                }}
                aria-hidden='true'
              >
                {' '}
                Undo Delete
                {' '}
              </h6>
              <span
                onClick={(): void => {
                  deletePermanantely();
                }}
                aria-hidden='true'
              >
                {' '}
                Delete permanently
                {' '}
              </span>
            </div>
          </div>
        )}
        <div className='name-header' id='sidesheet-header'>
          <div className='control-bar'>
            <InputBase
              className='input-base'
              value={val}
              onChange={(e): void => {
                setVal(e.target.value);
              }}
              onKeyPress={handleKeyPress}
              onBlur={handleBlur}
            />
            <IconButton
              onClick={(): void => {
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                isFullScreen ? setIsFullScreen(false) : dialogClose();
                handleCloseSideSheet();
              }}
            >
              <CloseIcon fontSize='small' />
            </IconButton>
          </div>
          <div className='menu-bar'>
            <span
              className='menu-link'
              onClick={(): void => {
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                if (singleSideSheetData?.building !== null) {
                  navigate(
                    `/workspace/budget-calendar/event-schedule/${singleSideSheetData?.id}/event`,
                  );
                } else {
                  enqueueSnackbar('Please select a building to use this functionality');
                }
              }}
              aria-hidden='true'
            >
              {' '}
              Schedule
              {' '}
            </span>
            <span
              className='menu-link'
              onClick={(): void => {
                dispatch(setTaskIntoFocus(true));
                document.getElementById('task-scroll-99')?.scrollIntoView({ block: 'start' });
              }}
              aria-hidden='true'
            >
              Task
            </span>
            <span
              className='menu-link'
              onClick={(): void => {
                document.getElementById('attachment-scroll-99')?.scrollIntoView();
              }}
              aria-hidden='true'
            >
              {' '}
              Attach
              {' '}
            </span>
            <span
              className='menu-link'
              onClick={(): void => {
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                if (singleSideSheetData?.building !== null) {
                  navigate(
                    `/workspace/budget-calendar/rfp-schedule/${singleSideSheetData?.id}/event`,
                  );
                } else {
                  enqueueSnackbar('Please select a building to use this functionality');
                }
              }}
              aria-hidden='true'
            >
              {' '}
              Send RFP
              {' '}

            </span>
            <span
              className='menu-link'
              aria-hidden='true'
              onClick={handleExportButton}
            >
              {' '}
              Export as PO
              {' '}
            </span>
            <span
              className='menu-link'
              aria-hidden='true'
              onClick={(): void => { setOpenEmailReminderDialog(true); }}
            >
              {' '}
              {singleSideSheetData !== null && singleSideSheetData.email_reminder_count === 0 ? 'Email reminder' : `Email rem...(${singleSideSheetData !== null ? singleSideSheetData.email_reminder_count : ''})`}
              {' '}
            </span>
            {/* <span
            className='menu-link'
            onClick={(): void => {
              navigator.clipboard.writeText(window.location.href);
              enqueueSnackbar('Copied', { variant: 'success' });
            }}
            aria-hidden='true'
          >
            {' '}
            Copy Link
            {' '}
          </span> */}
            <span className='menu-link'>
              {' '}
              <IconButton onClick={handleClick}>
                {' '}
                <MoreHorizIcon fontSize='small' />
                {' '}
              </IconButton>
              {' '}
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
                <Typography
                  sx={{ p: 2 }}
                  className='dialog-link'
                  onClick={(): void => {
                    navigator.clipboard.writeText(window.location.href);
                    enqueueSnackbar('Copied', { variant: 'success' });
                  }}
                  aria-hidden='true'
                >
                  {' '}
                  Copy Link
                  {' '}
                </Typography>
                <Typography
                  sx={{ p: 2 }}
                  className='dialog-link'
                  onClick={(): void => {
                    setIsFullScreen(!isFullScreen);
                  }}
                >
                  {' '}
                  {isFullScreen ? 'Exit Full Screen' : 'Full Screen'}
                  {' '}
                </Typography>
                {(singleSideSheetData?.po_id !== null && purchaseOrdersData?.status_disable_check !== true && purchaseOrdersData?.closed !== true)
          && (
            <Typography
              sx={{ p: 2 }}
              className='dialog-link'
              onClick={(): void => {
                handleChangeStatus();
              }}
            >
              Close PO
            </Typography>
          )}
                <Typography
                  sx={{ p: 2 }}
                  className='dialog-link'
                  onClick={(): void => {
                    deleteEvent(true);
                    handleClose();
                  }}
                >
                  Delete
                </Typography>
              </Popover>
            </span>
          </div>
        </div>
        <div className='underline' />
      </DialogTitle>
      <EmailReminderDialog openEmailReminderDialog={openEmailReminderDialog} setOpenEmailReminderDialog={setOpenEmailReminderDialog} sideSheetId={singleSideSheetData?.id} />
    </>
  );
}
