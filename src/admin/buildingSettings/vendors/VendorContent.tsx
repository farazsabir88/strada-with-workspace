/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import StradaLoader from 'shared-components/components/StradaLoader';
import { FileUploadIcon } from 'admin/buildingSettings/chartsOfAccounts/AccountsContent';
import PrimayButton from 'shared-components/components/PrimayButton';
import {
  Tooltip, TablePagination, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Box, Grid, Typography, Button, TableSortLabel,
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import StradaSearch from 'admin/buildingSection/budget-calendar/components/StradaSearch';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import type { AxiosResponse } from 'axios';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';

import { useSelector } from 'react-redux';
import type { RootState } from 'mainStore';
import type { IContactDetails, IVendorData, IVendorListingResponse } from './types';

interface IDataRowProps {
  row: IVendorData;
}

export default function VendorContent(): JSX.Element {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const rowCount = window.localStorage.getItem('vendorTableRowsPerPage');
  const { enqueueSnackbar } = useSnackbar();
  const currentWorkspace = useSelector((state: RootState) => state.workspaces.currentWorkspace.currentWorkspace);
  const [search, setSearch] = useState('');
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(Number(rowCount));
  const [sortOrder, setSortOrder] = useState('desc');
  const [sortBy, setSortBy] = useState('vendor');
  const [vendorData, setVendorData] = useState<IVendorData[]>([]);

  useEffect(() => {
    if (rowCount === null) {
      setRowsPerPage(25);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { isLoading } = useQuery(
    ['get/vendors', search],
    async () => axios({
      url: `api/workspace-vendor/?workspace=${currentWorkspace.id}`,
      method: 'get',
      params: {
        search,
      },
    }),
    {
      select: (res: AxiosResponse<IVendorListingResponse>) => res.data.detail,
      onSuccess: (res) => {
        setCurrentIndex(1);
        setVendorData(res);
      },
      onError: () => {
        enqueueSnackbar('Error fetching data.');
      },
    },
  );

  const handleChangePage = (event: unknown, newPage: number): void => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setPage(0);
    setRowsPerPage(+event.target.value);
    localStorage.setItem('vendorTableRowsPerPage', event.target.value);
  };

  const sortData = (value: string): void => {
    vendorData.sort(
      (a, b) => {
        if (a[value] === null) {
          return -1;
        } if (b[value] === null) {
          return 1;
        }
        if (a[value]! > b[value]!) {
          return sortOrder === 'desc' ? 1 : -1;
        }
        if (a[value] === b[value]) {
          return 0;
        }
        return sortOrder === 'desc' ? -1 : 1;
      },
    );
    setVendorData(vendorData);
  };

  const handleSort = (val: string): void => {
    if (sortBy === val) {
      if (sortOrder === 'asc') {
        setSortOrder('desc');
      } else {
        setSortOrder('asc');
      }
    } else {
      setSortBy(val);
      setSortOrder('asc');
    }
    sortData(val);
  };

  const { mutate: deleteVendor, isLoading: deleteLoader } = useMutation(
    async (id: number | string) => axios({
      url: `api/workspace-vendor/${id}/`,
      method: 'DELETE',
    }),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries('get/vendors').then();
        enqueueSnackbar('Deleted Successfully');
      },
      onError: () => {
        enqueueSnackbar('Error deleting data.');
      },
    },
  );

  function DataRow(props: IDataRowProps): JSX.Element {
    const { row } = props;
    const [open, setOpen] = React.useState(false);
    const {
      name, job, note, vendor_contacts, qty_contacts,
    } = row;
    const [innerSortOrder, setInnerSortOrder] = useState('desc');
    const [innerSortBy, setInnerSortBy] = useState('name');
    const [contactDetails, setContactDetails] = useState<IContactDetails[]>();

    useEffect(() => {
      setContactDetails(vendor_contacts);
    }, [vendor_contacts]);

    // useEffect(() => {
    //   if (Number(localStorage.getItem('vendorTableRowsPerPag')) !== 0) {
    //     setRowsPerPage(Number(localStorage.getItem('vendorTableRowsPerPag')));
    //   }
    //   console.log('perpage', rowCount);
    // }, [setRowsPerPage]);

    const sortInnerData = (value: string): void => {
      contactDetails?.sort(
        (a, b) => {
          if (a[value] === null) {
            return -1;
          } if (b[value] === null) {
            return 1;
          }
          if (a[value] === b[value]) {
            return 0;
          }
          return innerSortBy === 'desc' ? 1 : -1;
        },
      );
      setContactDetails(contactDetails);
    };

    const handleInnerSort = (val: string): void => {
      if (innerSortBy === val) {
        if (innerSortOrder === 'asc') {
          setInnerSortOrder('desc');
        } else {
          setInnerSortOrder('asc');
        }
      } else {
        setInnerSortBy(val);
        setInnerSortOrder('asc');
      }
      sortInnerData(val);
    };

    const onDeleteClick = (id: number | undefined): void => {
      if (id !== undefined) {
        deleteVendor(id);
      }
    };

    const onEditClick = (id: number | undefined): void => {
      navigate(`/workspace/settings/vendors/${id}`);
    };

    return (
      <>
        <TableRow sx={{ '& > *': { borderBottom: 'unset' } }} className='bc-table-body-row'>
          <TableCell>
            {vendor_contacts.length > 0 && (
              <IconButton
                aria-label='expand row'
                size='small'
                onClick={(): void => { setOpen(!open); }}
              >
                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
            )}
          </TableCell>
          {/* component='th' scope='row' */}
          <TableCell
            style={{ color: '#00CFA1' }}
            aria-hidden='true'
            onClick={(): void => { onEditClick(row?.id); }}
          >
            {name}
          </TableCell>
          <TableCell>{job}</TableCell>
          <TableCell>
            {note !== null && (
              <Tooltip title={note}>
                <p>{note.length > 93 ? `${note.substring(0, 93)}...` : note}</p>
              </Tooltip>
            )}
          </TableCell>
          <TableCell align='center'>{qty_contacts}</TableCell>
          <TableCell>
            <div className='contact-icons'>
              <i
                className='fas fa-pen'
                aria-hidden='true'
                onClick={(): void => { onEditClick(row?.id); }}
              />
              <i
                className='far fa-trash-alt'
                aria-hidden='true'
                onClick={(): void => { onDeleteClick(row?.id); }}
              />
            </div>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout='auto' unmountOnExit>
              <Box sx={{ margin: 1 }}>
                {/* size='small' aria-label='purchases' */}
                <Table id='inner-table'>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <TableSortLabel
                          active={innerSortBy === 'full_name'}
                          direction={innerSortOrder === 'asc' ? 'asc' : 'desc'}
                          onClick={(): void => { handleInnerSort('full_name'); }}
                        >
                          Name
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={innerSortBy === 'email'}
                          direction={innerSortOrder === 'asc' ? 'asc' : 'desc'}
                          onClick={(): void => { handleInnerSort('email'); }}
                        >
                          Email
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={innerSortBy === 'phone'}
                          direction={innerSortOrder === 'asc' ? 'asc' : 'desc'}
                          onClick={(): void => { handleInnerSort('phone'); }}
                        >
                          Phone
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={innerSortBy === 'role'}
                          direction={innerSortOrder === 'asc' ? 'asc' : 'desc'}
                          onClick={(): void => { handleInnerSort('role'); }}
                        >
                          Role
                        </TableSortLabel>
                      </TableCell>

                      <TableCell>
                        <TableSortLabel
                          active={innerSortBy === 'note'}
                          direction={innerSortOrder === 'asc' ? 'asc' : 'desc'}
                          onClick={(): void => { handleInnerSort('note'); }}
                        >
                          Notes
                        </TableSortLabel>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {contactDetails?.map((contact) => (
                      <TableRow key={contact.id}>
                        <TableCell>{contact.full_name}</TableCell>
                        <TableCell>{contact.email}</TableCell>
                        <TableCell>{contact.phone}</TableCell>
                        <TableCell>{contact.role}</TableCell>
                        <TableCell>
                          {contact.note !== null && (
                            <Tooltip title={contact.note}>
                              <p>{contact.note.length > 93 ? `${contact.note.substring(0, 93)}...` : contact.note}</p>
                            </Tooltip>
                          )}

                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </>
    );
  }

  const onAddClick = (): void => {
    navigate('/workspace/settings/vendors/new');
  };

  return (
    <div className='vendor-contacts-wrapper'>
      <StradaLoader open={deleteLoader || isLoading} />
      {vendorData.length > 0 && (
        <>
          <Grid container mt={2} spacing={3} className='search-field-wrapper d-flex justify-content-between'>
            <Grid item sm={6}>
              <Typography
                className='search-field-typo'
                style={{
                  fontFamily: 'Roboto-Medium', fontSize: '24px', color: 'rgba(33, 33, 33, 0.87)',
                }}
              >
                Vendors

              </Typography>
            </Grid>
            <Grid item sm={6} className='d-flex justify-content-end'>
              <StradaSearch
                value={search}
                setSearch={setSearch}
                placeholder='Search'
                className='w-70'
              />
              <Button onClick={onAddClick} className='text-transform-none text-white ms-3' variant='contained'> Add Vendor</Button>

            </Grid>
          </Grid>
          <div className='mt-3 mb-2' style={{ borderBottom: '1px solid rgba(224, 224, 224, 1)' }} />

          <TableContainer>
            <Table aria-label='collapsible table' className='sortable'>
              <TableHead>
                <TableRow>
                  <TableCell style={{ width: '5%' }} />
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === 'name'}
                      direction={sortOrder === 'asc' ? 'asc' : 'desc'}
                      onClick={(): void => { handleSort('name'); }}
                    >
                      Vendor
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === 'job'}
                      direction={sortOrder === 'asc' ? 'asc' : 'desc'}
                      onClick={(): void => { handleSort('job'); }}
                    >
                      Job
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === 'note'}
                      direction={sortOrder === 'asc' ? 'asc' : 'desc'}
                      onClick={(): void => { handleSort('note'); }}
                    >
                      Notes
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align='center'>
                    <TableSortLabel
                      active={sortBy === 'qty_contacts'}
                      direction={sortOrder === 'asc' ? 'asc' : 'desc'}
                      onClick={(): void => { handleSort('qty_contacts'); }}
                    >
                      QTY contacts
                    </TableSortLabel>
                  </TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {vendorData.length > 0
                 && vendorData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                   <DataRow row={row} key={row.id} />
                 ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              count={vendorData.length}
              rowsPerPage={rowsPerPage}
              component='div'
              className='vendor-pagination'
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              SelectProps={{
                inputProps: { 'aria-label': 'rows per page' },
                native: true,
              }}
            />
          </TableContainer>
        </>
      )}

      {vendorData.length === 0 && search !== '' && (
        <>
          <Grid container mt={2} spacing={3} className='search-field-wrapper d-flex justify-content-between'>
            <Grid item sm={6}>
              <Typography
                className='search-field-typo'
                style={{
                  fontFamily: 'Roboto-Medium', fontSize: '24px', color: 'rgba(33, 33, 33, 0.87)',
                }}
              >
                Vendors

              </Typography>
            </Grid>
            <Grid item sm={6} className='d-flex justify-content-end'>
              <StradaSearch
                value={search}
                setSearch={setSearch}
                placeholder='Search'
                className='w-70'
              />
              <Button onClick={onAddClick} className='text-transform-none text-white ms-3' variant='contained'> Add Vendor</Button>

            </Grid>
          </Grid>
          <div className='mt-3 mb-2' style={{ borderBottom: '1px solid rgba(224, 224, 224, 1)' }} />

          <div className='empty-array-wrapper'>
            <p>No data is found matching your search</p>
            <div className='create-new-button'>
              <PrimayButton
                onClick={(): void => { setSearch(''); }}
              >
                Reset Search
              </PrimayButton>
            </div>
          </div>
        </>
      )}

      {currentIndex === 1 && vendorData.length === 0 && search === '' && (
        <div className='not-found-message'>
          <h5>No vendor</h5>
          <h6>You haven’t added any vendor contacts</h6>
          <div className='buttons-wrapper d-flex'>
            {/* <div className='file-btn-wrapper' aria-hidden='true'>
              <input
                type='file'
                name='file'
                id='selectImage'
                style={{ display: 'none' }}
              />
              <FileUploadIcon />
              <p>Upload</p>
            </div> */}
            <PrimayButton onClick={onAddClick}> Add Vendor </PrimayButton>
          </div>
        </div>
      )}
    </div>
  );
}
