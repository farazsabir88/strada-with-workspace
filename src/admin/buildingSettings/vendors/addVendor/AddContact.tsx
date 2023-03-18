/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */

import { Grid, Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import InputField from 'shared-components/inputs/InputField';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MailIcon from 'assests/images/mail_icon.svg';
import PhoneIcon from 'assests/images/phone_icon.svg';
import RoleIcon from 'assests/images/role_icon.svg';
import NotesIcon from 'assests/images/notes_icon.svg';

import { useSnackbar } from 'notistack';
import type { IContactDetails } from '../types';

interface IProps {
  contactList: IContactDetails[];
  setContactList: (value: IContactDetails[]) => void;
  setAddContact: (value: boolean) => void;
  addContact: boolean;
}

export default function AddContact(props: IProps): JSX.Element {
  const { enqueueSnackbar } = useSnackbar();
  const {
    setContactList, setAddContact, contactList, addContact,
  } = props;
  const [contact, setContact] = useState<IContactDetails>({
    full_name: '', email: '', phone: '', role: '', note: '', unique_position_key: '',
  });
  const [editContact, setEditContact] = useState(false);
  const [editContactIndex, setEditContactIndex] = useState(NaN);
  //   const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  const phoneRegex = /^[0-9+() -]+$/;
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

  const onContactSubmit = (): void => {
    if (contact.email !== null && emailRegex.test(contact.email)) {
      if (editContact) {
        contactList[editContactIndex] = contact;
        setContactList(contactList);
        setEditContact(false);
      } else {
        setContactList([...contactList, { ...contact, unique_position_key: Date.now().toString() }]);
        setAddContact(false);
      }
      setContact({
        full_name: '', email: '', phone: '', role: '', note: '', unique_position_key: '',
      });
    } else {
      enqueueSnackbar('Enter valid email.');
    }
  };

  const getContactDisabledCheck = (): boolean => {
    if (contact.full_name === '' || contact.email === '') {
      return true;
    }
    return false;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    if (name === 'phone') {
      if (phoneRegex.exec(value) || value === '') {
        setContact({ ...contact, [name]: value });
      }
    } else {
      setContact({ ...contact, [name]: value });
    }
  };

  const handleContactCancel = (): void => {
    setAddContact(false);
    setEditContact(false);
    setContact({
      full_name: '', email: '', phone: '', role: '', note: '', unique_position_key: '',
    });
  };

  useEffect(() => {
    console.log({ contact });
  }, [contact]);

  const renderAddContact = (): JSX.Element => (
    <>
      <Grid container columnSpacing={3} className='mt-3'>
        <Grid item sm={12} md={12}>

          <InputField
            name='full_name'
            label='Full Name*'
            value={contact.full_name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void => { handleChange(e); }}
          />
        </Grid>
        <Grid item sm={6} md={6}>

          <InputField
            name='email'
            label='Email*'
            value={contact.email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void => { handleChange(e); }}
          />
        </Grid>
        <Grid item sm={6} md={6}>

          <InputField
            name='phone'
            label='Phone'
            value={contact.phone}
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void => { handleChange(e); }}
          />
        </Grid>
        <Grid item sm={12} md={12}>

          <InputField
            name='role'
            label='Role'
            value={contact.role}
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void => { handleChange(e); }}
          />
        </Grid>
        <Grid item sm={12} md={12}>
          <InputField
            name='note'
            label='Type your notes (optional)'
            type='text'
            value={contact.note}
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void => { handleChange(e); }}
          />
        </Grid>
        <Grid item sm={6} className='text-start mt-3'>
          <Button
            variant='outlined'
            className='text-transform-none text-dark'
            style={{ border: '1px solid #e4e4e4' }}
            onClick={(): void => { handleContactCancel(); }}
          >
            Cancel
          </Button>
          <Button
            onClick={(): void => { onContactSubmit(); }}
            variant='contained'
            disabled={getContactDisabledCheck()}
            className='ms-2 text-transform-none text-white'
          >
            Save Contact
          </Button>
        </Grid>
      </Grid>

      {editContact && <div className='mt-3 mb-2' style={{ borderBottom: '1px solid rgba(224, 224, 224, 1)' }} />}

    </>
  );

  const handleEditContact = (index: number): void => {
    setContact(contactList[index]);
    setEditContactIndex(index);
    setEditContact(true);
  };

  const handleDeleteContact = (index: number): void => {
    const data = [...contactList];
    data.splice(index, 1);
    setContactList(data);
  };

  return (
    <div className='mt-2'>
      { contactList.length > 0 && contactList.map((vc, index) => {
        if (editContact && contact.unique_position_key === vc.unique_position_key) {
          return renderAddContact();
        }
        return (
          <Grid item className='message-card'>
            <div className='message-email'>
              {vc.full_name}
              <div className='message-options'>
                <EditIcon className='cursor-pointer' onClick={(): void => { handleEditContact(index); }} />
                <span style={{ marginLeft: '5px' }}>
                  <DeleteIcon className='cursor-pointer' onClick={(): void => { handleDeleteContact(index); }} />
                </span>
              </div>
            </div>
            { vc.email !== '' && vc.email !== null && (
              <div className='message-subject d-flex mt-1 mb-1'>
                <img src={MailIcon} alt='' className='me-3' style={{ height: '100%' }} />
                <p style={{ color: '#00CFA1' }}>{vc.email}</p>
              </div>
            )}
            { vc.phone !== '' && vc.phone !== null && (
              <div className='message-subject d-flex mt-2 mb-2'>
                <img src={PhoneIcon} alt='' className='me-3' style={{ height: '100%' }} />
                <p>{vc.phone}</p>
              </div>
            )}
            { vc.role !== '' && vc.role !== null && (
              <div className='message-subject d-flex mt-2 mb-2'>
                <img src={RoleIcon} alt='' className='me-3' style={{ height: '100%' }} />
                <p>{vc.role}</p>
              </div>
            )}
            { vc.note !== '' && vc.note !== null && (
              <div className='message-subject d-flex mt-2 mb-2'>
                <img src={NotesIcon} alt='' className='me-3' style={{ height: '100%' }} />
                <p>{vc.note}</p>
              </div>
            )}
          </Grid>
        );
      })}
      { addContact && renderAddContact()}

    </div>
  );
}
