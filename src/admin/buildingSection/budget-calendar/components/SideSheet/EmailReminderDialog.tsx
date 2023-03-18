/* eslint-disable no-param-reassign */
/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import DialogTitle from '@mui/material/DialogTitle';
import makeStyles from '@mui/styles/makeStyles';
import DeleteIcon from '@mui/icons-material/Delete';
import SelectInput from 'shared-components/inputs/SelectInput';
import SelectSearchInput from 'shared-components/inputs/SelectSearchInput';
import InputField from 'shared-components/inputs/InputField';
import { useSelector } from 'react-redux';
import type { RootState } from 'mainStore';
import type { IPeopleResponse } from 'admin/buildingSettings/people/types';
import type { AxiosResponse } from 'axios';
import { useSnackbar } from 'notistack';
import type { SelectChangeEvent } from '@mui/material/Select';
import StandardButton from 'shared-components/components/StandardButton';
import { Button } from '@mui/material';
import type {
  Imember, IEmailReminderData,
} from 'admin/buildingSection/budget-calendar/types';

export interface IEmailReminderDialog {
  openEmailReminderDialog: boolean;
  setOpenEmailReminderDialog: (open: boolean) => void;
  sideSheetId: number | string | undefined;
}

const useStyles = makeStyles(() => ({
  dialog: {
    '& .MuiDialog-container': {
      '& .MuiPaper-root': {
        maxWidth: '680px',
        width: '680px',
      },

    },
  },
  dialogTitle: {
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: '16px',
    lineHeight: '24px',
    letterSpacing: '0.15px',
    color: 'rgba(33, 33, 33, 0.87)',
    mixBlendMode: 'normal',
  },
  customDays: {
    '& .MuiFormControl-root': {
      '& .MuiFilledInput-root': {
        '& .MuiFilledInput-input': {
          padding: '16px',
        },
      },

    },
  },
  addButton: {
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '12px',
    lineHeight: '20px',
    letterSpacing: '0.1px',
    color: '#00CFA1',
    marginRight: '24px',
    cursor: 'pointer',
  },
  contextText: {
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: '12px',
    lineHeight: '24px',
    letterSpacing: '0.5px',
    color: 'rgba(33, 33, 33, 0.6)',
    mixBlendMode: 'normal',
    borderTop: '1px solid #DDDDDD',
    borderBottom: '1px solid #DDDDDD',
    width: '680px',
    maxHeight: '420px',
    overflowY: 'scroll',
    padding: '20px 20px 0 20px',
  },
  primaryBtnBox: {
    width: '60px',
    height: '40px',
    marginLeft: '8px',
    marginRight: '16px',
  },
}));

export default function EmailReminderDialog(props: IEmailReminderDialog): JSX.Element {
  const { openEmailReminderDialog, setOpenEmailReminderDialog, sideSheetId } = props;
  const queryClient = useQueryClient();
  const currentWorkspace = useSelector(
    (state: RootState) => state.workspaces.currentWorkspace.currentWorkspace,
  );
  const { enqueueSnackbar } = useSnackbar();
  const [emailReminderData, setEmailReminderData] = useState<IEmailReminderData[]>([]);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const classes = useStyles();
  const singleSideSheetData = useSelector((state: RootState) => state.workspaces.sideSheetData.singleSideSheetData);

  useEffect(() => {
    if (singleSideSheetData?.email_reminders !== undefined) {
      const data: IEmailReminderData[] = JSON.parse(JSON.stringify(singleSideSheetData.email_reminders));
      setEmailReminderData(data);
    }
  }, [singleSideSheetData, openEmailReminderDialog]);

  useEffect(() => {
    if (emailReminderData.length !== 0) {
      let error = false;
      // eslint-disable-next-line array-callback-return
      emailReminderData.map((item): void => {
        if (item.due_date_choice === '' || item.send_email_choice === '' || (item.due_date_choice === 4 && (item.custom_days === 0)) || (item.send_email_choice === 0 && (item.member === null))) {
          setIsDisabled(true);
          error = true;
        }
      });
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!error) {
        setIsDisabled(false);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emailReminderData]);

  const { data: users = [] } = useQuery('get/people', async () => axios({
    url: '/api/filter/assignee/',
    params: {
      workspace: currentWorkspace.id,
    },
    method: 'get',

  }), {
    select: (res: AxiosResponse<IPeopleResponse>) => {
      const options = res.data.detail.map((user) => ({
        name: user.name,
        id: user.id,
        avatar: user.avatar,
      }));

      return options;
    },
  });

  const addNewEmailReminder = (): void => {
    const obj = {
      unique_position_key: Date.now().toString(),
      due_date_choice: '',
      custom_days: 0,
      custom_choice: 0,
      send_email_choice: '',
      member: null,
    };
    setEmailReminderData([...emailReminderData, obj]);
  };
  const handleEmailReminderData = (obj: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent, unique_position_key: number | string): void => {
    setEmailReminderData(emailReminderData.map((item: IEmailReminderData) => {
      const newData = item;
      if (newData.unique_position_key === unique_position_key) {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (obj.target.name === 'custom_days') {
          newData.custom_days = Number(obj.target.value);
        } else if (obj.target.name === 'due_date_choice') {
          newData.due_date_choice = obj.target.value;
        } else if (obj.target.name === 'custom_choice') {
          newData.custom_choice = obj.target.value;
        } else if (obj.target.name === 'send_email_choice') {
          newData.send_email_choice = obj.target.value;
        }
      }
      return item;
    }));
  };
  const handleEmailReminderMember = (value: Imember | null, unique_position_key: number | string): void => {
    setEmailReminderData(emailReminderData.map((item: IEmailReminderData) => {
      if (item.unique_position_key === unique_position_key) {
        const newData = item;
        newData.member = value;
      }
      return item;
    }));
  };
  const deleteEmailReminder = (unique_position_key: number | string): void => {
    const newData = emailReminderData.filter((item) => item.unique_position_key !== unique_position_key);
    setEmailReminderData(newData);
  };
  const { mutate: saveEmailReminder } = useMutation(
    async () => axios({
      url: `/api/budget-calendar/event-reminder/${sideSheetId}/`,
      method: 'PATCH',
      data: {
        email_reminders: emailReminderData,
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
        await queryClient.invalidateQueries('get-single-sidesheet').then();
        setOpenEmailReminderDialog(false);
        enqueueSnackbar('Email reminder was added');
      },
    },
  );
  const { mutate: deleteAllEmailReminders } = useMutation(
    async () => axios({
      url: `/api/budget-calendar/event-reminder/${sideSheetId}/`,
      method: 'PATCH',
      data: {
        email_reminders: [],
      },
    }),
    {
      onSuccess: async (): Promise<void> => {
        await queryClient.invalidateQueries('sidesheet/get-events').then();
        await queryClient.invalidateQueries('prioritized-events').then();
        await queryClient.invalidateQueries('user-assigned-events').then();
        await queryClient.invalidateQueries('others-events').then();
        await queryClient.invalidateQueries('allevents/get-events').then();
        await queryClient.invalidateQueries('user-created-events').then();
        setOpenEmailReminderDialog(false);
        setEmailReminderData([]);
        enqueueSnackbar('Email reminder was deleted');
      },
    },
  );

  return (

    <Dialog
      open={openEmailReminderDialog}
      onClose={(): void => { setOpenEmailReminderDialog(false); }}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
      className={classes.dialog}
    >
      <div className='d-flex align-items-center justify-space-between'>
        <DialogTitle className={classes.dialogTitle} id='alert-dialog-title'>
          Set email reminder
        </DialogTitle>
        <h4 aria-hidden='true' className={classes.addButton} onClick={addNewEmailReminder}>
          {' '}
          + Add
          {' '}
        </h4>
      </div>

      <DialogContent className={classes.contextText}>
        { emailReminderData.length > 0 ? (
          <div>
            { emailReminderData.map((item) => (
              <>
                <div className='d-flex align-items-center justify-content-between'>
                  <div style={{ width: '45%' }}>
                    <SelectInput
                      value={item.due_date_choice.toString()}
                      name='due_date_choice'
                      label='When due date is approaching...'
                      onChange={(obj: SelectChangeEvent): void => { handleEmailReminderData(obj, item.unique_position_key); }}
                      options={[{ name: 'Due today', value: 0 }, { name: '1 day before', value: 1 }, { name: '3 days before', value: 2 }, { name: '1 week before', value: 3 }, { name: 'Custom', value: 4 }]}
                      defaultValue='true'
                      showPleaseSelect={false}
                    />
                  </div>
                  {item.due_date_choice.toString() === '4' ? (
                    <>
                      <div style={{ width: '20%' }} className={classes.customDays}>
                        <InputField
                          id='custom_days'
                          name='custom_days'
                          type='number'
                          placeholder='0'
                          onChange={(event: React.ChangeEvent<HTMLInputElement>): void => { handleEmailReminderData(event, item.unique_position_key); }}
                          value={item.custom_days === 0 ? null : item.custom_days}
                        />
                      </div>
                      <div style={{ width: '20%' }}>
                        <SelectInput
                          value={item.custom_choice.toString()}
                          name='custom_choice'
                          label='days'
                          onChange={(obj: SelectChangeEvent): void => { handleEmailReminderData(obj, item.unique_position_key); }}
                          options={[{ name: 'days', value: 0 }, { name: 'weeks', value: 1 }, { name: 'months', value: 2 }]}
                          defaultValue='true'
                          showPleaseSelect={false}
                        />
                      </div>
                    </>
                  )
                    : (
                      <div style={{ width: '43%' }}>
                        <SelectInput
                          value={item.send_email_choice.toString()}
                          name='send_email_choice'
                          label='Send email to'
                          onChange={(obj: SelectChangeEvent): void => { handleEmailReminderData(obj, item.unique_position_key); }}
                          options={[{ name: 'Member', value: 0 }, { name: 'Assignee', value: 1 }, { name: 'All collaborators', value: 2 }]}
                          defaultValue='true'
                          showPleaseSelect={false}
                        />
                      </div>
                    )}
                  <div aria-hidden='true' style={{ marginBottom: '20px', cursor: 'pointer' }} onClick={(): void => { deleteEmailReminder(item.unique_position_key); }}><DeleteIcon /></div>
                </div>
                {item.due_date_choice.toString() === '4' && item.send_email_choice.toString() === '0'
                  ? (
                    <div className='d-flex align-items-center justify-content-between'>
                      <div style={{ width: '45%' }}>
                        <SelectInput
                          value={item.send_email_choice.toString()}
                          name='send_email_choice'
                          label='Send email to'
                          onChange={(obj: SelectChangeEvent): void => { handleEmailReminderData(obj, item.unique_position_key); }}
                          options={[{ name: 'Member', value: 0 }, { name: 'Assignee', value: 1 }, { name: 'All collaborators', value: 2 }]}
                          defaultValue='true'
                          showPleaseSelect={false}
                        />
                      </div>
                      <div style={{ width: '43%', marginBottom: '20px' }}>
                        <SelectSearchInput
                          value={item.member}
                          name='member'
                          label='Member'
                          onChange={(obj: React.SyntheticEvent, value): void => { handleEmailReminderMember(value, item.unique_position_key); }}
                          options={users}
                        />
                      </div>
                      <div style={{ marginBottom: '20px', width: '3%' }} />
                    </div>
                  )
                  : item.due_date_choice.toString() === '4'
                    ? (
                      <div style={{ width: '92%' }}>
                        <SelectInput
                          value={item.send_email_choice.toString()}
                          name='send_email_choice'
                          label='Send email to'
                          onChange={(obj: SelectChangeEvent): void => { handleEmailReminderData(obj, item.unique_position_key); }}
                          options={[{ name: 'Member', value: 0 }, { name: 'Assignee', value: 1 }, { name: 'All collaborators', value: 2 }]}
                          defaultValue='true'
                          showPleaseSelect={false}
                        />
                      </div>
                    )
                    : item.send_email_choice.toString() === '0'
                      ? (
                        <div style={{ width: '92%', marginBottom: '20px' }}>
                          <SelectSearchInput
                            value={item.member}
                            name='member'
                            label='Member'
                            onChange={(obj: React.SyntheticEvent, value): void => { handleEmailReminderMember(value, item.unique_position_key); }}
                            options={users}
                          />
                        </div>
                      ) : null}
              </>
            ))}
          </div>
        )
          : <div style={{ paddingBottom: '20px' }}>No reminders yet. To add a reminder, click the “Add” button.</div>}
      </DialogContent>
      {/* <DialogActions> */}
      <div className='d-flex justify-space-between align-items-center p-2'>
        <Button disabled={emailReminderData.length === 0} startIcon={<DeleteIcon />} style={{ textTransform: 'inherit', color: emailReminderData.length === 0 ? 'rgba(33, 33, 33, 0.38)' : '#00CFA1' }} onClick={(): void => { deleteAllEmailReminders(); }}> Delete all </Button>
        <div className='d-flex align-items-center'>
          <StandardButton onClick={(): void => { setOpenEmailReminderDialog(false); }}> Cancel </StandardButton>
          <div className={classes.primaryBtnBox}>
            <Button
              onClick={(): void => { saveEmailReminder(); }}
              disabled={isDisabled || emailReminderData.length === 0}
              style={{ textTransform: 'inherit', color: isDisabled || emailReminderData.length === 0 ? 'rgba(33, 33, 33, 0.38)' : 'white', background: isDisabled || emailReminderData.length === 0 ? '#E4E4E4' : '#00CFA1' }}
            >
              {' '}
              save
              {' '}

            </Button>
          </div>
        </div>
      </div>

      {/* </DialogActions> */}
    </Dialog>
  );
}
