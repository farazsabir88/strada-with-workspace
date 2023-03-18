/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import React, { useState } from 'react';
import {
  Dialog, Box,
  Select, MenuItem, FormControl, Grid, DialogActions,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { WithContext as ReactTags } from 'react-tag-input';
import makeStyles from '@mui/styles/makeStyles';
import type { SelectChangeEvent } from '@mui/material/Select';
import StandardButton from 'shared-components/components/StandardButton';
import PrimayButton from 'shared-components/components/PrimayButton';
import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import type { IDetailErrorResponse } from 'admin/AdminFormTypes';
import { useSelector } from 'react-redux';
import type { RootState } from 'mainStore';

interface IProps {
  open: boolean;
  handleClose: () => void;
}

interface IData {
  emails: string[];
  role: number;
}

const useStyles = makeStyles(() => ({
  dialog: {
    '& .MuiDialog-container': {
      '& .MuiPaper-root': {
        maxWidth: '680px',
        width: '450px',
        padding: '15px',
      },

    },
  },
}));

export default function InviteMember(props: IProps): JSX.Element {
  const { open, handleClose } = props;
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const currentWorkspace = useSelector((state: RootState) => state.workspaces.currentWorkspace.currentWorkspace);
  const [inviteeEmails, setInviteeEmails] = useState<{ id: string; text: string }[]>([]);
  const [emailError, setEmailError] = useState<boolean>(false);
  const [created, setCreated] = useState<boolean>(false);
  const [role, setRole] = useState<string>('0');
  const menuItems = ['Admin', 'Member', 'Engineer'];

  const handleDelete = (i: number): void => {
    setInviteeEmails([...inviteeEmails.filter((tag, index) => index !== i)]);
    setEmailError(false);
  };

  const handleAddition = (email: { id: string; text: string }): void => {
    const validation = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (email.text.trim() && validation.test(email.text)) {
      setInviteeEmails([...inviteeEmails, email]);
      setEmailError(false);
    } else {
      setEmailError(true);
    }
  };

  const handleChange = (event: SelectChangeEvent): void => {
    setRole(event.target.value);
  };

  const handleInviteClose = (): void => {
    setInviteeEmails([]);
    setRole('0');
    handleClose();
  };

  const { mutate: inviteMembers } = useMutation(async (data: IData) => axios({
    url: `api/workspace-member/?workspace=${currentWorkspace.id}`,
    method: 'post',
    data,
  }), {
    onSuccess: async () => {
      await queryClient.invalidateQueries('get/members').catch().then();
      enqueueSnackbar('Members invited successfully.');
      handleInviteClose();
    },
    onError: (e: IDetailErrorResponse) => {
      enqueueSnackbar(e.data.response.message);
      setCreated(false);
    },
  });

  const handleInvite = (): void => {
    const data = {
      emails: inviteeEmails.map((email) => email.text),
      role: Number(role) + 1,
    };
    inviteMembers(data);
  };

  return (

    <div>
      <Dialog
        open={open}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        className={classes.dialog}
      >
        <Box className='box-style'>
          <h6 className='members-heading'>Invite members</h6>
          <Grid item md={12}>
            <div className='bcc-wrapper' style={{ minHeight: '57px', marginTop: '10px' }}>
              <label style={{ color: 'rgba(33, 33, 33, 0.6)', marginLeft: '10px' }}>
                Enter email address, comma separated
              </label>
              <ReactTags
                tags={inviteeEmails}
                handleDelete={handleDelete}
                handleAddition={(tagone): void => { handleAddition(tagone); }}
                placeholder=' '
                // autofocus
                // handleInputBlur={(tagVal): void => { handleAddition({ id: tagVal, text: tagVal }); }}
              />
            </div>
            <label className='error-message' style={{ paddingBottom: '0px' }}>
              {emailError ? 'Enter a valid email' : ''}
            </label>
          </Grid>
          <div className='select-role'>
            <p>Invite as</p>
            <FormControl variant='standard' sx={{ m: 1, mt: 2, minWidth: 100 }}>
              <Select
                value={role}
                onChange={handleChange}
              >
                {menuItems.map((item, i) => <MenuItem key={`people-item-two-${item}`} value={String(i)}>{item}</MenuItem>)}
              </Select>
            </FormControl>
          </div>
        </Box>
        <DialogActions>
          <StandardButton onClick={handleInviteClose}> Cancel </StandardButton>

          <PrimayButton className='w-auto text-white' disabled={emailError || inviteeEmails.length === 0 || created} onClick={(): void => { handleInvite(); setCreated(true); }}> Invite </PrimayButton>

        </DialogActions>
      </Dialog>
    </div>

  );
}
