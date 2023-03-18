/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import React, { useState } from 'react';
import { Grid } from '@mui/material';
import { useQuery } from 'react-query';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import StradaLoader from 'shared-components/components/StradaLoader';
import type { IVendorListing } from 'admin/purchaseOrder/types';
import Sidebar from 'admin/sidebar';

export default function ViewPoDetail(): JSX.Element {
  const { poId } = useParams();
  const navigate = useNavigate();
  const [singlePOData, setSinglePOData] = useState<IVendorListing>();

  const { isLoading } = useQuery(
    'get-single-PO',
    async () => axios({
      url: `api/purchase-orders/${poId}`,
      method: 'GET',
    }),
    {
      onSuccess: (res) => {
        if (res.data !== undefined) {
          const { data } = res;
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          setSinglePOData(data);
        }
      },
    },
  );

  const getStatusValue = (value: number | undefined): JSX.Element => {
    if (value === 0) {
      return <div className='f-badge not-approved'>Not Approved</div>;
    } if (value === 1) {
      return <div className='f-badge waiting'>Waiting for Approval</div>;
    } if (value === 2) {
      return <div className='f-badge approved'>Approved</div>;
    } if (value === 3) {
      return <div className='f-badge rejected'>Rejected</div>;
    }
    return <div />;
  };
  return (
    <div style={{ paddingTop: '82px', display: 'flex' }}>
      <Sidebar variant='main' activeLink='purchase-order' />
      <StradaLoader open={isLoading} />
      <div>
        <Grid container justifyContent='center' className='mt-4'>
          <Grid item sm={12} md={6}>
            <Grid container columnSpacing={2}>
              <Grid item sm={12} className='heading-PO'>
                <div className='cursor-pointer me-3' aria-hidden='true' onClick={(): void => { navigate('/workspace/purchase-orders'); }}>
                  <ArrowBackIcon />
                </div>
                <div className='PO-name'>
                  {singlePOData?.event_name}
                </div>
                <div className='PO-status'>
                  {getStatusValue(singlePOData?.status)}
                </div>
              </Grid>
              <Grid item sm={12} className='heading-PO mt-4 mb-3'>
                <div className='PO-name'>Vendor Information</div>
              </Grid>
              <Grid item sm={12} md={6} className='PO-group'>
                <div className='PO-group-title'>PO Number</div>
                <div className='PO-group-description'>{singlePOData?.po_number}</div>

              </Grid>
              <Grid item sm={12} md={6} className='PO-group'>
                <div className='PO-group-title'>Property</div>
                <div className='PO-group-description'>{ singlePOData?.property_info !== null ? singlePOData?.property_info : '' }</div>

              </Grid>
              <Grid item sm={12} md={12} className='mb-4 mt-4 PO-group'>
                <div className='PO-group-title'>Vendor</div>
                <div className='PO-group-description'>{ singlePOData?.vendor !== null ? singlePOData?.vendor.label : '' }</div>

              </Grid>
              <Grid item sm={12} md={12} className='mb-4 mt-4 PO-group'>
                <div className='PO-group-title'>Vendor Info</div>
                <div className='PO-group-description'>{singlePOData?.vendor_info}</div>

              </Grid>
              <Grid item sm={12} md={4} className='PO-group'>
                <div className='PO-group-title'>Expense Type</div>
                <div className='PO-group-description'>{singlePOData?.expense_type.label}</div>

              </Grid>
              <Grid item sm={12} md={4} className='PO-group'>
                <div className='PO-group-title'>Payment Due</div>
                <div className='PO-group-description'>{singlePOData?.Payment_due !== null && moment(singlePOData?.Payment_due).format('MM/DD/YYYY')}</div>

              </Grid>
              <Grid item sm={12} md={4} className='PO-group'>
                <div className='PO-group-title'>Last Received</div>
                <div className='PO-group-description'>{singlePOData?.last_received }</div>

              </Grid>
              <Grid item sm={12} className='PO-group'>
                <div className='PO-group-title'>Description</div>
                <div className='PO-group-description'>{singlePOData?.description}</div>
              </Grid>

              <Grid item sm={12} md={4} className='PO-group'>
                <div className='PO-group-title'>Delivery Date</div>
                <div className='PO-group-description'>{singlePOData?.delivery_date !== null && moment(singlePOData?.delivery_date).format('MM/DD/YYYY')}</div>
              </Grid>
              <Grid item sm={12} md={4} className='PO-group'>
                <div className='PO-group-title'>Order Date</div>
                <div className='PO-group-description'>{singlePOData?.order_date !== null && moment(singlePOData?.order_date).format('MM/DD/YYYY')}</div>
              </Grid>
              <Grid item sm={12} md={4} className='PO-group'>
                <div className='PO-group-title'>Required by Date</div>
                <div className='PO-group-description'>{singlePOData?.Required_by !== null && moment(singlePOData?.Required_by).format('MM/DD/YYYY')}</div>
              </Grid>
              <Grid item sm={12} className='PO-group'>
                <div className='PO-group-title'>Total Amount</div>
                <div className='PO-group-description'>
                  $
                  {singlePOData?.total}
                </div>
              </Grid>

            </Grid>
          </Grid>
        </Grid>
        <Grid container direction='row' justifyContent='center' alignItems='center'>
          <Grid item sm={12} md={6}>
            <div className='po-table-section'>
              <div className='mt-3 mb-2 d-flex justify-content-between'>
                <h6> Details  </h6>
              </div>
              <div className='po-table mb-4'>
                <div className='po-table-head'>
                  <div className='po-head-description'>Descripton</div>
                  <div className='po-head-account'>G/L Account</div>
                  <div className='po-head-QTY'>QTY</div>
                  <div className='po-head-price'>Unit Price</div>
                  <div className='po-head-amount'>Amount</div>
                </div>
                {singlePOData?.details.map((detail) => (
                  <div className='po-table-input' key={detail?.description}>
                    <div className='po-body-description'>{detail?.description}</div>
                    <div className='po-body-account'>{ detail?.account?.label}</div>
                    <div className='po-body-QTY'>{detail?.quantity}</div>
                    <div className='po-body-price'>
                      $
                      {detail?.unit_price}
                    </div>
                    <div className='po-body-amount'>
                      $
                      {detail?.amount}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Grid>
        </Grid>
      </div>

      {/* {Array.isArray(singlePOData?.yardi_response) && (
          <div className='yardi-response'>
            <div className='yardi-response-head'>Yardi Response:</div>
            {singlePOData?.yardi_response.map((res) => (
              <div className='yardi-response-message'>
                {res.message}
              </div>
            ))}
          </div>
        )} */}
    </div>
  );
}
