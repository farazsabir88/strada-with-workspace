/* eslint-disable @typescript-eslint/prefer-optional-chain */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import React, { useState } from 'react';
import POExport from 'assests/images/po.svg';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import type { IVendorListing } from 'admin/purchaseOrder/types';
import { useSelector } from 'react-redux';
import type { RootState } from 'mainStore';
import StradaSpinner from 'shared-components/components/StradaSpinner';

export default function TaskAttachments(): JSX.Element {
  const queryClient = useQueryClient();
  const singleSideSheetData = useSelector((state: RootState) => state.workspaces.sideSheetData.singleSideSheetData);

  const [purchaseOrdersData, setPurchaseOrdersData] = useState<IVendorListing | undefined>();

  const { mutate: updateStatus, isLoading } = useMutation(async ({ closed }: { closed: boolean }) => axios({
    url: `api/purchase-orders/${singleSideSheetData?.po_id}/`,
    method: 'PATCH',
    data: { closed },
  }), {
    onSuccess: async () => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      await queryClient.invalidateQueries('get-PO-by-id').catch().then();
      await queryClient.invalidateQueries('get-single-sidesheet').then();
      await queryClient.invalidateQueries('sidesheet/get-events').then();
      await queryClient.invalidateQueries('get-single-sidesheet').then();
      await queryClient.invalidateQueries('others-events').then();
    },

  });
  useQuery(
    ['get-PO-by-id', singleSideSheetData?.po_id],
    async () => axios({
      url: `api/purchase-orders/${singleSideSheetData?.po_id}`,
      method: 'GET',
    }),
    {
      enabled: singleSideSheetData?.po_id !== undefined,
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onSuccess: (res) => {
        if (res !== undefined) {
          const datas: IVendorListing = res.data;
          setPurchaseOrdersData(datas);
        }
      },
    },
  );

  const handleChangeStatus = (): void => {
    if (singleSideSheetData !== null && singleSideSheetData.po_id !== null) {
      updateStatus({ closed: true });
    }
  };

  return (
    <div className='assignee-sheet-bar'>
      <h6 className='side-sheet-side-label'> Purchase Order </h6>
      <div className='assignee-sheet-popover'>
        <div className='popover-btn' aria-hidden='true'>
          <a
            className='content'
            style={{ cursor: 'pointer', padding: '0px 5px 0px 0px', width: 'auto' }}
            href={`${window.location.origin}/workspace/purchase-orders/${singleSideSheetData?.po_id}`}
            target='_blank'
            rel='noreferrer'
          >
            <span className='po-export'>{purchaseOrdersData?.vendor?.label}</span>
            <img src={POExport} alt='Congratulations' />
          </a>
          {(singleSideSheetData?.po !== null && purchaseOrdersData?.status_disable_check !== true && purchaseOrdersData?.closed !== true && !isLoading)
          && (
            <span
              aria-hidden='true'
              style={{ cursor: 'pointer', color: '#00CFA1', fontSize: '14px' }}
              onClick={(): void => { handleChangeStatus(); }}
            >
              Close PO
            </span>
          )}
          {isLoading ? <StradaSpinner open={isLoading} message='Updating' /> : null}
        </div>
      </div>
    </div>
  );
}
