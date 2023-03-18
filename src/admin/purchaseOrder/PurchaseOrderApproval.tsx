/* eslint-disable @typescript-eslint/prefer-optional-chain */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import React, { useEffect, useState } from 'react';
import Logo from 'assests/images/Logo.svg';
import {
  Table, TableHead, TableRow, TableCell, TableBody, TablePagination, Dialog, DialogTitle, DialogContent,
} from '@mui/material';
import 'admin/purchaseOrder/_purchaseOrder.scss';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import axios from 'axios';
import type { AxiosResponse } from 'axios';
import { useSnackbar } from 'notistack';
import moment from 'moment';
import PrimayButton from 'shared-components/components/PrimayButton';
import StradaLoader from 'shared-components/components/StradaLoader';
import type {
  IPOResponse, IPOResponseData, IVendorListing, IDetails, IApprovalPayload,
} from './types';

function PersonStartIcon(): JSX.Element {
  return (
    <svg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path d='M9.01562 7V4.98438H10.9844V7H9.01562ZM4.32812 15.6719C5.92188 17.2344 7.8125 18.0156 10 18.0156C12.1875 18.0156 14.0625 17.2344 15.625 15.6719C17.2188 14.0781 18.0156 12.1875 18.0156 10C18.0156 7.8125 17.2188 5.9375 15.625 4.375C14.0625 2.78125 12.1875 1.98438 10 1.98438C7.8125 1.98438 5.92188 2.78125 4.32812 4.375C2.76562 5.9375 1.98438 7.8125 1.98438 10C1.98438 12.1875 2.76562 14.0781 4.32812 15.6719ZM2.92188 2.96875C4.89062 1 7.25 0.015625 10 0.015625C12.75 0.015625 15.0938 1 17.0312 2.96875C19 4.90625 19.9844 7.25 19.9844 10C19.9844 12.75 19 15.1094 17.0312 17.0781C15.0938 19.0156 12.75 19.9844 10 19.9844C7.25 19.9844 4.89062 19.0156 2.92188 17.0781C0.984375 15.1094 0.015625 12.75 0.015625 10C0.015625 7.25 0.984375 4.90625 2.92188 2.96875ZM9.01562 15.0156V9.01562H10.9844V15.0156H9.01562Z' fill='#212121' fillOpacity='0.87' />
    </svg>
  );
}

export default function PurchaseOrderApproval(): JSX.Element {
  const { sign, id } = useParams();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(25);
  const [open, setOpen] = useState<boolean>(false);
  const [documentList, setDocumentList] = useState<IVendorListing[]>();

  useQuery('list_po_approvals', async () => axios({
    url: '/api/purchase-orders/list_po_approvals/',
    data: {
      token: sign,
      id,
    },
    method: 'POST',

  }), {
    select: (res: AxiosResponse<IPOResponseData>) => res.data.result,
    onSuccess: (res: IPOResponse[]) => {
      res[0].data.forEach((item) => {
        if (item.signed_by !== undefined && item.signed_by.length > 0 && item.status === 2) {
          item.approved = true;
        //   item.signed_by.forEach((element) => {
        //     if (element.signed_user_email === res[0].email) {
        //       item.approved = true;
        //     } else {
        //       item.approved = false;
        //     }
        //   });
        } else {
          item.approved = false;
        }
      });
      setDocumentList(res[0].data);
    },
  });

  const handleRowClick = (index: number): void => {
    setCurrentIndex(index);
    setOpen(true);
  };

  const handleChangePage = (event: unknown, newPage: number): void => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setPage(0);
    setRowsPerPage(+event.target.value);
  };

  const renderGLAccountNo = (details: IDetails[]): string => {
    let accounts = '';
    for (let i = 0; i < details.length; i += 1) {
      if (i === (details.length - 1)) {
        // eslint-disable-next-line no-unsafe-optional-chaining
        accounts += details[i]?.account.label;
      } else {
        accounts = `${accounts}${details[i].account.label}, `;
      }
    }
    return accounts;
  };

  const { mutate: approvePO, isLoading } = useMutation(async (data: IApprovalPayload) => axios({
    url: 'api/purchase-orders/send_po_approvals/',
    method: 'POST',
    data,
  }), {
    onSuccess: async (): Promise<void> => {
      await queryClient.invalidateQueries('list_po_approvals').then();
    },
    onError: (): void => {
      enqueueSnackbar('Po Approval failed. Try Again.');
    },
  });

  //   const { mutate: disApprovePO, isLoading: disapproving } = useMutation(async (data: IApprovalPayload) => axios({
  //     url: 'api/purchase-orders/reject_po_approval/',
  //     method: 'POST',
  //     data,
  //   }), {
  //     onSuccess: async (): Promise<void> => {
  //       await queryClient.invalidateQueries('list_po_approvals').then();
  //     },
  //     onError: (): void => {
  //     //   enqueueSnackbar('Po Disapproval failed. Try Again.');
  //     },
  //   });

  useEffect(() => {
    if (isLoading) {
      setOpen(false);
    }
  }, [isLoading]);

  const onSubmit = (item: IVendorListing): void => {
    const data = {
      invoice_file: item.id,
      sign_date: moment(new Date()).format('YYYY-MM-DD'),
      token: sign,
    };
    approvePO(data);
  };

  //   const handleDontApprove = (item: IVendorListing): void => {
  //     const data = {
  //       invoice_file: item.id,
  //       sign_date: moment(new Date()).format('YYYY-MM-DD'),
  //       token: sign,
  //     };
  //     disApprovePO(data);
  //   };

  const managerApproval = (index: number): JSX.Element[] | null => {
    if (documentList === undefined) return null;
    const signedBy = documentList[index].signed_by;
    if (signedBy === undefined) return null;

    const component = Array.isArray(signedBy) && signedBy.map((item) => (
      <div className='content'>
        <div className='name'>{`${item.signed_user_first_name} ${item.signed_user_last_name}`}</div>
        <div className='date'>{moment(item.date).format('MM/DD/YYYY')}</div>
      </div>
    ));
    return component || null;
  };

  return (
    <>
      <StradaLoader open={isLoading} message='Updating...' />
      <div className='signpdfcontainer'>
        <div className='logo'>
          <img className='logo-css' src={Logo} alt='' />
        </div>
        <div className='table-container'>
          <div
            className='heading'
          >
            Purchase Orders
          </div>
          <div className='table-pdf'>
            <div className='Invoice-table'>
              <Table aria-label='simple table'>
                <TableHead>
                  <TableRow>
                    <TableCell align='left' style={{ width: '10%', fontSize: '17px' }}>PO #</TableCell>
                    <TableCell align='left' style={{ width: '19%', fontSize: '17px' }}>Property</TableCell>
                    <TableCell align='left' style={{ width: '14%', fontSize: '17px' }}>Vendor</TableCell>
                    <TableCell align='left' style={{ width: '12%', fontSize: '17px' }}>PO Date</TableCell>
                    <TableCell align='left' style={{ width: '10%', fontSize: '17px' }}>PO $</TableCell>
                    <TableCell align='left' style={{ width: '17%', fontSize: '17px' }}>Person</TableCell>
                    {/* <TableCell align='left' style={{ width: '4%', fontSize: '17px' }} /> */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {documentList !== undefined
                 && documentList.length > 0
                 && documentList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => (
                   <TableRow key={item.id} hover>
                     <TableCell
                       align='left'
                       style={{ color: '#00CFA1', paddingLeft: '8px !important' }}
                       onClick={(): void => { handleRowClick((page * rowsPerPage) + index); }}
                     >
                       {/* {item.yardi_response[1] && item.yardi_response[1].message === 'Success' && item.yardi_response[0].message.substring(45, 49)} */}
                     </TableCell>
                     <TableCell align='left' onClick={(): void => { handleRowClick((page * rowsPerPage) + index); }}>
                       {item.property_info}
                     </TableCell>
                     <TableCell align='left' onClick={(): void => { handleRowClick((page * rowsPerPage) + index); }}>
                       {item.vendor !== null ? item.vendor.label : ''}
                     </TableCell>
                     <TableCell align='left' onClick={(): void => { handleRowClick((page * rowsPerPage) + index); }}>
                       {moment(item.created_at).format('MM/DD/YYYY')}
                     </TableCell>
                     <TableCell align='left' onClick={(): void => { handleRowClick((page * rowsPerPage) + index); }}>
                       $
                       {item.total}
                     </TableCell>
                     <TableCell align='left' onClick={(): void => { handleRowClick((page * rowsPerPage) + index); }}>
                       {item.signed_by && item.signed_by.length > 0 && (
                         <div className='person-list'>
                           {/* <div className='icon'>
                             <div className='tooltiptext'>
                               <div>
                                 Approved
                                 {' '}
                                 {' '}
                                 {item.signed_by[0].date}
                               </div>
                               {item.signed_by.map((name) => (
                                 <div className='name-person'>
                                   {name.signed_user_first_name}
                                   {' '}
                                   {name.signed_user_last_name}
                                 </div>
                               ))}
                             </div>
                             <i className='fas fa-info-circle' />
                           </div>
                            */}
                           <PersonStartIcon />
                           <div className='name ms-1'>
                             {`${item.signed_by[0].signed_user_first_name} ${item.signed_by[0].signed_user_last_name}`}
                             {' '}
                           </div>
                           {item.signed_by.length > 1 && (
                             <div className='extra'>
                               (+
                               {item.signed_by.length - 1}
                               )
                             </div>
                           )}
                         </div>
                       )}
                     </TableCell>
                     <TableCell align='left'>
                       {item.approved !== undefined && item.approved ? (
                         <div className='btn-approve'>
                           <PrimayButton>
                             <i className='fas fa-check' />
                                &nbsp;Approved
                           </PrimayButton>
                         </div>
                       ) : (
                         <div className='btn-approve'>
                           <PrimayButton onClick={(): void => { onSubmit(item); }}>
                             Approve
                           </PrimayButton>
                         </div>
                       )}
                     </TableCell>
                   </TableRow>
                 ))}
                </TableBody>
              </Table>
            </div>
          </div>
          <div className='Budgetcalender-pagination' style={{ bottom: '4px' }}>
            <TablePagination
              rowsPerPageOptions={[10, 25, 50]}
              count={documentList?.length ?? 0}
              rowsPerPage={rowsPerPage}
              component='div'
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              SelectProps={{
                inputProps: { 'aria-label': 'rows per page' },
                native: true,
              }}
            />

          </div>
        </div>

        {documentList?.[currentIndex] && (
          <Dialog className=' POApproval' open={open} onClose={(): void => { setOpen(false); }} aria-labelledby='form-dialog-title'>
            <DialogTitle id='form-dialog-title'>
              <div className='title-container'>
                <div className='arrow' aria-hidden='true' onClick={(): void => { setOpen(false); }}>
                  <i className='fas fa-arrow-left' />
                </div>
                <div className='name'>
                  #
                  {documentList[currentIndex].id}
                </div>
                <div
                  className='not-approve'
                  aria-hidden='true'
                >
                  Dont Approve
                </div>
                {documentList[currentIndex].approved !== null && (documentList[currentIndex].approved ?? false) ? (
                  <div className='approve'>
                    <PrimayButton>
                      <i className='fas fa-check' />
                        &nbsp;Approved
                    </PrimayButton>
                  </div>
                ) : (
                  <div className='approve'>
                    <PrimayButton
                      onClick={(): void => { onSubmit(documentList[currentIndex]); }}
                    >
                      Approve
                    </PrimayButton>
                  </div>
                )}
              </div>
            </DialogTitle>
            <DialogContent style={{ width: 900 }}>
              <div className='dialog-container'>
                <div className='PO-approver-box'>
                  <div className='building-name'>{documentList[currentIndex].event_name}</div>
                  <div className='PO-double'>
                    <div className='item-one'>
                      <div className='po-heading'>PO Number</div>
                      <div className='po-desc'>
                        #
                        {/* {documentList[currentIndex].yardi_response[1] && documentList[currentIndex].yardi_response[1].message === 'Success' && documentList[currentIndex].yardi_response[0].message.substring(45, 49)} */}
                      </div>
                    </div>
                    <div className='item-two'>
                      <div className='po-heading'>Vendor</div>
                      <div className='po-desc'>{documentList[currentIndex].vendor !== null ? documentList[currentIndex].vendor?.label : '—'}</div>
                    </div>
                  </div>
                  <div className='PO-single'>
                    <div className='po-heading'>Vendor Info</div>
                    <div className='po-desc'>{documentList[currentIndex].vendor_info !== '' ? documentList[currentIndex].vendor_info : '-'}</div>
                  </div>
                  <div className='PO-double'>
                    <div className='item-one'>
                      <div className='po-heading'>Expense Type</div>
                      <div className='po-desc'>{documentList[currentIndex].expense_type?.label ? documentList[currentIndex].expense_type.label : '-'}</div>
                    </div>
                    <div className='item-two'>
                      <div className='po-heading'>Payment Due</div>
                      <div className='po-desc'>{documentList[currentIndex].Payment_due ? moment(documentList[currentIndex].Payment_due).format('MM/DD/YYYY') : '-'}</div>
                    </div>
                  </div>
                  <div className='PO-single'>
                    <div className='po-heading'>Last Received</div>
                    <div className='po-desc'>{documentList[currentIndex].last_received !== '' ? documentList[currentIndex].last_received : '-'}</div>
                  </div>
                  <div className='PO-single'>
                    <div className='po-heading'>Description</div>
                    <div className='po-desc'>{documentList[currentIndex].description !== '' ? documentList[currentIndex].description : '-'}</div>
                  </div>
                  <div className='PO-double'>
                    <div className='item-one'>
                      <div className='po-heading'>Delivery Date</div>
                      <div className='po-desc'>{documentList[currentIndex].delivery_date ? moment(documentList[currentIndex].delivery_date).format('MM/DD/YYYY') : '-'}</div>
                    </div>
                    <div className='item-two'>
                      <div className='po-heading'>Order Date</div>
                      <div className='po-desc'>{documentList[currentIndex].delivery_date ? moment(documentList[currentIndex].delivery_date).format('MM/DD/YYYY') : '-'}</div>
                    </div>
                  </div>
                  <div className='PO-double'>
                    <div className='item-one'>
                      <div className='po-heading'>Required by Date</div>
                      <div className='po-desc'>{documentList[currentIndex].delivery_date ? moment(documentList[currentIndex].delivery_date).format('MM/DD/YYYY') : '-'}</div>
                    </div>
                    <div className='item-two'>
                      <div className='po-heading'>Total Amount</div>
                      <div className='po-desc'>
                        $
                        {documentList[currentIndex].total}
                      </div>
                    </div>
                  </div>
                  <div className='details-PO-approver'>
                    <div className='detail-head'>Details</div>
                    <div className='detail-table'>
                      <div className='detail-table-head'>
                        <div className='head-description'>Descripton</div>
                        <div className='head-account'>G/L Account</div>
                        <div className='head-QTY'>QTY</div>
                        <div className='head-price'>Unit Price</div>
                        <div className='head-amount'>Amount</div>
                      </div>
                      {documentList[currentIndex].details.length > 0 && documentList[currentIndex].details.map((detail) => (
                        <div className='detail-table-head'>
                          <div className='head-description'>{detail?.description}</div>
                          <div className='head-account'>{ detail?.account?.label }</div>
                          <div className='head-QTY'>{detail?.quantity}</div>
                          <div className='head-price'>
                            $
                            {detail?.unit_price}
                          </div>
                          <div className='head-amount'>
                            $
                            {detail.amount}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className='details'>
                  <div className='heading'>{documentList[currentIndex].property_info}</div>
                  <div className='po-approval-gl-table'>
                    <div className='po-approval-gl'>
                      <div className='name'>G/L Account No:</div>
                      <div className='date'>{renderGLAccountNo(documentList[currentIndex].details)}</div>
                    </div>
                    <div className='po-approval-gl'>
                      <div className='name'>Amount:</div>
                      <div className='date'>
                        $
                        {documentList[currentIndex].total}
                      </div>
                    </div>
                  </div>

                  <div className='persons'>
                    <div className='heading'>
                      <div className='name'>Manager Approval</div>
                      <div className='date'>Date</div>
                    </div>
                    {managerApproval(currentIndex)}
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </>
  );
}
