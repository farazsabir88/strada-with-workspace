/* eslint-disable array-callback-return */
import React, { useState } from 'react';
import {
  Button, Grid,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useParams, useNavigate } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { useMutation, useQuery } from 'react-query';
import CustomLoader from 'shared-components/components/CustomLoader';
import type { AxiosResponse } from 'axios';
import axios from 'axios';
import './_create-checklist-template.scss';
import Notifications, { notify } from 'react-notify-toast';
import LinearProgress from '@mui/material/LinearProgress';
import { withStyles } from '@mui/styles';
import Header from './Header';
import AllTasks from './AllTasks';
import TaskDetails from './TaskDetails';
import type {
  IState, ITasks, IErrorResponse,
} from './types';

const BorderLinearProgress = withStyles(() => ({
  root: {
    height: 3,
    borderRadius: 5,
  },
  colorPrimary: {
    backgroundColor: '#eeeeee',
  },
  bar: {
    borderRadius: 5,
    backgroundColor: '#00CFA1',
  },
}))(LinearProgress);

export default function CreateChecklistTemplate(): JSX.Element {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [checklistTemplateName, setChecklistTemplateName] = useState<string>('');
  const [data, setData] = useState<ITasks[]>();
  const [templateName, setTemplateName] = useState<string>('');
  const [focusedTask, setFocusedTask] = useState<ITasks>();
  const [addChanges, setAddChanges] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showContent, setShowContent] = useState<boolean>(true);
  const [closeContent, setCloseContent] = useState<boolean>(false);
  const [openDiscardChangesDialog, setOpenDiscardChangesDialog] = useState<boolean>(false);
  const [openRealTimeUpdateDialog, setOpenRealTimeUpdateDialog] = useState<boolean>(false);
  const [openUpdatingNChecklistDialog, setOpenUpdatingNChecklistDialog] = useState<boolean>(false);
  const [checklistCount, setChecklistCount] = useState<number>(0);
  const [progressValue, setProgressValue] = useState<number>(0);
  const [isBackButtonClicked, setIsBackButtonClicked] = useState<boolean>(false);

  const onBackButtonEvent = (): void => {
    if (!isBackButtonClicked) {
      setOpenDiscardChangesDialog(true);
    } else {
      window.history.back();
    }
  };

  useQuery(
    'get/checklist-template',
    async () => axios({
      url: `/api/checklist-template/${templateId}/`,
      method: 'get',
    }),
    {
      select: (res: AxiosResponse<IState>) => res.data,
      onSuccess: (res: IState) => {
        setChecklistTemplateName(res.template_name);
        setData(res.tasks);
        setFocusedTask(res.tasks[0]);
        setTemplateName(res.template_name);
        setIsLoading(false);
      },
    },
  );

  const { mutate: getCeleryProgress } = useMutation(async () => axios({
    url: '/api/checklist-celery-progress/',
    method: 'post',
    data: {
      template: templateId,
    },
  }), {
    onSuccess: (res) => {
      setProgressValue(Number(res.data.detail.progress));
      if (res.data.detail.progress !== 100) {
        getCeleryProgress();
      }
    },
  });

  const { mutate: handleUpdateAllChecklists } = useMutation(async () => axios({
    url: '/api/checklist-template/update_all_checklist/',
    method: 'post',
    data: {
      template: templateId,
    },
  }), {
    onSuccess: () => {
      setOpenRealTimeUpdateDialog(false);
      setOpenUpdatingNChecklistDialog(true);
      getCeleryProgress();
    },
  });

  const { mutate: handleUpdateChecklistTemplate } = useMutation(async () => axios({
    url: `/api/checklist-template/${templateId}/`,
    method: 'patch',
    data: {
      template_name: templateName,
      tasks: data,
    },
  }), {
    onSuccess: (res) => {
      if (res.data.detail.checklist_count > 0) {
        setOpenRealTimeUpdateDialog(true);
        setChecklistCount(Number(res.data.detail.checklist_count));
      } else {
        setIsBackButtonClicked(true);
        window.removeEventListener('popstate', onBackButtonEvent);
        window.history.back();
      }
    },
    onError: (res: IErrorResponse) => {
      if (res.data.response.code === 'unique') {
        enqueueSnackbar('Template Name Already Exist');
      }
    },
  });

  function onUpdateChecklistTemplate(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    let error = false;
    if (data !== undefined) {
      data.map((tasks) => {
        tasks.content.map((item) => {
          if (item.files !== undefined && item.type === 'file' && item.files.file_name === '') {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            notify.show('File is Required', 'error', 2000);
            error = true;
          } else if (item.type === 'text' && (item.value === '')) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            notify.show('Editor text is Required', 'error', 2000);
            error = true;
          }
        });
      });
    }
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!error) {
      handleUpdateChecklistTemplate();
    }
  }
  return (
    <div className='create-checklist-template'>
      {isLoading ? <div style={{ height: '80vh' }} className='vh-50 d-flex justify-content-center align-items-center'><CustomLoader /></div>
        : (
          <form onSubmit={(event: React.FormEvent<HTMLFormElement>): void => { onUpdateChecklistTemplate(event); }}>
            <Header checklistTemplateName={checklistTemplateName} templateName={templateName} setTemplateName={setTemplateName} addChanges={addChanges} isBackButtonClicked={isBackButtonClicked} setIsBackButtonClicked={setIsBackButtonClicked} onBackButtonEvent={onBackButtonEvent} />
            <Grid container>
              <Grid item sm={5}>
                <AllTasks data={data} setData={setData} focusedTask={focusedTask} setFocusedTask={setFocusedTask} setAddChanges={setAddChanges} />
              </Grid>
              <TaskDetails data={data} setData={setData} focusedTask={focusedTask} showContent={showContent} setShowContent={setShowContent} closeContent={closeContent} setCloseContent={setCloseContent} setAddChanges={setAddChanges} />
            </Grid>
          </form>
        )}
      <Dialog
        open={openDiscardChangesDialog}
      >
        <DialogContent style={{ width: 400, padding: '24px' }}>
          <div className='dialog-heading'>Discard changes?</div>
          <span
            className='dialog-body'
            style={{
              fontSize: '14px', color: 'rgba(33, 33, 33, 0.6)', fontWeight: '400', marginTop: '15px',
            }}
          >
            All unpublished edits to this will be discarded and can’t be recovered.
          </span>
        </DialogContent>
        <DialogActions style={{ paddingRight: '20px' }}>
          <Button
            style={{ textTransform: 'inherit' }}
            onClick={(): void => {
              setOpenDiscardChangesDialog(false);
              window.history.pushState(null, '', window.location.href);
            }}
            color='primary'
          >
            Cancel
          </Button>
          <Button variant='contained' onClick={(): void => { window.history.back(); }} style={{ textTransform: 'inherit', color: 'white', background: '#00CFA1' }} color='primary' autoFocus>
            Discard
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openRealTimeUpdateDialog}
        keepMounted
      >
        <DialogContent style={{ width: 430, padding: '24px' }}>
          <div className='dialog-heading' style={{ fontWeight: 400, fontFamily: 'Roboto' }}>Confirm real-time run update?</div>
          <span
            className='dialog-body'
            style={{
              fontSize: '12px', color: 'rgba(33, 33, 33, 0.6)', fontWeight: '400', marginTop: '15px',
            }}
          >
            This template has
            {' '}
            {checklistCount}
            {' '}
            checklists runs in progress.
            <br />
            Do you want to update them to reflect the published changes?

          </span>
        </DialogContent>
        <DialogActions style={{ paddingRight: '20px' }}>
          <Button
            style={{ textTransform: 'inherit' }}
            onClick={(): void => {
              setOpenRealTimeUpdateDialog(false);
              setIsBackButtonClicked(true);
              window.removeEventListener('popstate', onBackButtonEvent);
              window.history.back();
            }}
            color='primary'
          >
            Don’t update
          </Button>
          <Button variant='contained' onClick={(): void => { handleUpdateAllChecklists(); }} style={{ textTransform: 'inherit', color: 'white', background: '#00CFA1' }} color='primary' autoFocus>
            Update
            {' '}
            {checklistCount}
            {' '}
            checklists
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openUpdatingNChecklistDialog}
        keepMounted
      >
        <DialogContent style={{ width: 500, padding: '24px' }}>
          <div className='dialog-heading'>
            Updating
            {' '}
            {checklistCount}
            {' '}
            checklists
          </div>
          <div style={{ margin: '10px 0px' }}><BorderLinearProgress variant='determinate' value={progressValue} /></div>
          <span
            className='dialog-body'
            style={{
              fontSize: '14px', color: 'rgba(33, 33, 33, 0.6)', fontWeight: '400', marginTop: '20px',
            }}
          >
            This update can be done in the background, feel free to navigate away from this page.
          </span>
        </DialogContent>
        <DialogActions style={{ paddingRight: '20px' }}>
          <Button variant='contained' onClick={(): void => { setOpenUpdatingNChecklistDialog(false); setIsBackButtonClicked(true); window.removeEventListener('popstate', onBackButtonEvent); navigate('/workspace/checklists'); }} style={{ textTransform: 'inherit', color: 'white', background: '#00CFA1' }} color='primary' autoFocus>
            Return to the checklists
          </Button>
        </DialogActions>
      </Dialog>
      <Notifications />
    </div>
  );
}
