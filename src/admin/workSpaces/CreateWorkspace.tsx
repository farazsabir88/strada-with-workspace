/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import {
  Button, Select, MenuItem, FormControl, Grid,
} from '@mui/material';
import {
  useNavigate,
} from 'react-router-dom';
import { WithContext as ReactTags } from 'react-tag-input';
import type { SelectChangeEvent } from '@mui/material/Select';
import './_create-new-workspace.scss';
import InputField from 'shared-components/inputs/InputField';
import { useMutation } from 'react-query';
import { useSnackbar } from 'notistack';
import axios from 'axios';

export default function CreateWorkspace(): JSX.Element {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [workspaceName, setWorkspaceName] = useState<string>('');
  const [members, setMembers] = useState<{ id: string; text: string }[]>([]);
  const [membersError, setMembersError] = useState<boolean>(false);
  const [workspaceNameError, setWorkspaceNameError] = useState<boolean>(false);
  const [created, setCreated] = useState<boolean>(false);
  const [role, setRole] = useState<string>('0');
  const menuItems = ['Admin', 'Member'];

  const handleDeleteMember = (i: number): void => {
    setMembers([...members.filter((tag, index) => index !== i)]);
    setMembersError(false);
  };
  const handleAddition = (vb: { id: string; text: string }): void => {
    const validation = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (vb.text.trim() && validation.test(vb.text)) {
      setMembers([...members, vb]);
      setMembersError(false);
    } else if (vb.text.trim() === '') {
      setMembersError(false);
    } else {
      setMembersError(true);
    }
  };
  const handleChange = (event: SelectChangeEvent): void => {
    setRole(event.target.value);
  };
  const { mutate: handleCreateWorkspace } = useMutation(async () => axios({
    url: '/api/workspace/',
    method: 'post',
    data: {
      name: workspaceName,
      members: members.map((singlemembers) => singlemembers.text),
      members_role: role,
    },
  }), {
    onSuccess: (res) => {
      if (res.data.detail === 'Success') {
        navigate('/workspaces');
        enqueueSnackbar('Workspace Created Successfully!');
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      } else if (res.data.detail[0].name[0]) {
        setWorkspaceNameError(true);
      }
    },
  });
  return (
    <div className='create-new-workspace-wrapper'>
      <div className='create-new-workspace-form'>
        <h5 className='heading'>Create Workspace</h5>
        <div className={workspaceNameError ? 'input-field-wrapper-error' : 'input-field-wrapper'}>
          <InputField
            type='text'
            label='What is the name of your organization?'
            name='name'
            value={workspaceName}
            onChange={(event): void => { setWorkspaceName(event.target.value); setWorkspaceNameError(false); }}
          />
          <label className='error-message' style={{ paddingBottom: '0px' }}>
            {' '}
            {workspaceNameError ? 'This workspace already exists' : ''}
            {' '}
          </label>
        </div>
        <h6 className='members-heading'>Invite members</h6>
        <Grid item md={12}>
          <div className='bcc-wrapper' style={{ minHeight: '57px', marginTop: '10px' }}>
            <label> Enter email address, comma separated </label>
            <ReactTags
              tags={members}
              handleDelete={handleDeleteMember}
              handleAddition={(tagone): void => { handleAddition(tagone); }}
              placeholder=' '
              // autofocus
              handleInputBlur={(tagVal): void => { handleAddition({ id: tagVal, text: tagVal }); }}
            />
          </div>
          <label className='error-message' style={{ paddingBottom: '0px' }}>
            {' '}
            {membersError ? 'Enter a valid email' : ''}
            {' '}
          </label>
        </Grid>
        <div className='select-role'>
          <p>Invite as</p>
          <FormControl variant='standard' sx={{ m: 1, mt: 2, minWidth: 100 }}>
            <Select
              value={role}
              // defaultValue={String(0)}
              onChange={handleChange}
            >
              {menuItems.map((item, i) => <MenuItem key={`people-item-two-${item}`} value={i}>{item}</MenuItem>)}
            </Select>
          </FormControl>
        </div>

        <div className='button-div'>
          <Button
            variant='contained'
            disabled={workspaceName.replace(/^\s+|\s+$/g, '') === '' || workspaceNameError || created}
            style={{ textTransform: 'inherit', color: workspaceName.replace(/^\s+|\s+$/g, '') === '' || workspaceNameError ? 'rgba(33, 33, 33, 0.38)' : 'white', background: workspaceName.replace(/^\s+|\s+$/g, '') === '' || workspaceNameError ? '#E4E4E4' : '#00CFA1' }}
            color='primary'
            onClick={(): void => { handleCreateWorkspace(); setCreated(true); }}
            autoFocus
          >
            Create workspace
          </Button>
        </div>

      </div>
    </div>
  );
}
