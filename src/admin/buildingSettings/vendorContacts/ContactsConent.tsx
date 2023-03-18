/* eslint-disable react-hooks/exhaustive-deps */
import React, { useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { useSelector } from 'react-redux';
import type { Cell } from 'react-table';
import PrimayButton from 'shared-components/components/PrimayButton';
import CustomTable from 'shared-components/tables/CustomTable';
import StradaLoader from 'shared-components/components/StradaLoader';
import type { RootState } from 'mainStore';
import type { IDataObject } from 'formsTypes';
import ContactDilaog from './ContactDialog';
import type { IContactAction, IDeleteAction, IDetailAction } from './types';
import DeleteDiloag from './DeleteDialog';
import DetailDiloag from './DetailDialog';

const initalDataObject = {
  company: '',
  created_at: '',
  email: '',
  id: 0,
  job: '',
  name: '',
  notes: '',
  phone: '',
  property: 0,
  surname: '',
  updated_at: '',
};

export default function ContactsConent(): JSX.Element {
  const [open, setOpen] = useState<boolean>(false);
  const [delAction, setDelAction] = useState<IDeleteAction>({ open: false });
  const [detailAction, setDetailAction] = useState<IDetailAction>({
    open: false,
    data: undefined,
  });
  const [action, setAction] = useState<IContactAction>({
    type: 'add',
    data: initalDataObject,
  });
  const currentBuilding = useSelector(
    (state: RootState) => state.workspaces.currentBuilding,
  );

  const handleClose = (): void => {
    setOpen(false);
    setAction({ type: 'add', data: undefined });
  };
  const handleDetailClose = (): void => {
    setDetailAction({ open: false, data: undefined });
  };
  const handleCloseDelAction = (): void => {
    setDelAction({ open: false });
    handleDetailClose();
  };

  const {
    data,
    isLoading,
  }: { data: IDataObject[] | undefined; isLoading: boolean } = useQuery(
    ['get/vendor-contacts', currentBuilding],
    async () => axios({
      url: '/api/vendor-contact/',
      method: 'GET',
      params: {
        property_id: currentBuilding.id,
      },
    }),
    {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      select: (res) => res.data.result,
      enabled: Boolean(currentBuilding),
    },
  );

  const handleEdit = (ac: IContactAction): void => {
    setAction(ac);
    setOpen(true);
    handleDetailClose();
  };

  const columns = useMemo(
    () => [
      {
        Header: 'Vendor',
        accessor: 'company',
        Cell: (cell: Cell<IDataObject>): JSX.Element => {
          const { row } = cell;
          const { original } = row;
          return (
            <div
              onClick={(): void => {
                setDetailAction({ open: true, data: original });
              }}
              aria-hidden='true'
            >
              {original.company}
            </div>
          );
        },
      },
      {
        Header: 'Email',
        accessor: 'email',
        Cell: (cell: Cell<IDataObject>): JSX.Element => {
          const { row } = cell;
          const { original } = row;
          return (
            <div
              onClick={(): void => {
                setDetailAction({ open: true, data: original });
              }}
              aria-hidden='true'
            >
              {original.email}
            </div>
          );
        },
      },
      {
        Header: 'Phone',
        accessor: 'phone',
        Cell: (cell: Cell<IDataObject>): JSX.Element => {
          const { row } = cell;
          const { original } = row;
          return (
            <div
              onClick={(): void => {
                setDetailAction({ open: true, data: original });
              }}
              aria-hidden='true'
            >
              {original.phone}
            </div>
          );
        },
      },
      {
        Header: 'Name',
        accessor: 'name',
        Cell: (cell: Cell<IDataObject>): JSX.Element => {
          const { row } = cell;
          const { original } = row;
          return (
            <div
              onClick={(): void => {
                setDetailAction({ open: true, data: original });
              }}
              aria-hidden='true'
            >
              {original.name}
              {' '}
              {original.surname}

            </div>
          );
        },
      },
      {
        Header: '',
        accessor: 'none',
        Cell: (cell: Cell<IDataObject>): JSX.Element => {
          const { row } = cell;
          const { original } = row;
          return (
            <div className='contact-icons'>
              <i
                onClick={(): void => {
                  handleEdit({ type: 'edit', data: original });
                }}
                className='fas fa-pen'
                aria-hidden='true'
              />
              <i
                onClick={(): void => {
                  setDelAction({ open: true, id: original.id });
                }}
                className='far fa-trash-alt'
                aria-hidden='true'
              />
            </div>
          );
        },
      },
    ],
    [currentBuilding, data],
  );

  return (
    <div className='vendor-contacts-wrapper'>
      <ContactDilaog open={open} handleClose={handleClose} action={action} />
      <DeleteDiloag delAction={delAction} handleClose={handleCloseDelAction} />
      <DetailDiloag
        open={detailAction.open}
        data={detailAction.data}
        handleClose={handleDetailClose}
        deleteContact={(delProps: IDeleteAction): void => {
          setDelAction(delProps);
        }}
        editContact={(editProps: IContactAction): void => {
          handleEdit(editProps);
        }}
      />
      <StradaLoader open={isLoading} />
      <div className='header'>
        <h6> Vendor Contacts </h6>
        <div className='button-wrapper'>
          <PrimayButton
            onClick={(): void => {
              setOpen(true);
            }}
          >
            {' '}
            Add Contact
            {' '}
          </PrimayButton>
        </div>
      </div>
      <div className='vendor-table-wrapper'>
        <CustomTable {...{ columns, data: data !== undefined ? data : [] }} />
      </div>
    </div>
  );
}
