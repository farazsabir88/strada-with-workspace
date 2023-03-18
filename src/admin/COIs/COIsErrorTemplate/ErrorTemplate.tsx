/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import * as React from 'react';
import { useSelector } from 'react-redux';
import './_coisErrors.scss';
import type { AxiosResponse } from 'axios';
import { useQueryClient, useQuery } from 'react-query';
import axios from 'axios';
import PrimayButton from 'shared-components/components/PrimayButton';
import type { RootState } from 'mainStore';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import type { Ipayload, Ierror } from './types';
import EmailTemplate from './emailTempalteCOIs/EmailTemplate';

export default function ErrorTemplateCOI(): JSX.Element {
  const [emailData, setEmailData] = React.useState<Ierror | null>(null);

  const currentWorkspace = useSelector((state: RootState) => state.workspaces.currentWorkspace.currentWorkspace);

  const { data: coisErrors } = useQuery(
    'get/cois-error',
    async () => axios({
      url: `/api/coise-errors/?workspace=${currentWorkspace.id}`,
      method: 'get',
    }),
    {
      enabled: Boolean(currentWorkspace.id),
      select: (res: AxiosResponse<Ipayload>) => res.data.results,
    },
  );

  const queryClient = useQueryClient();
  React.useEffect(() => {
    if (emailData !== null) return;
    async function fetchData(): Promise <void> {
      await queryClient.invalidateQueries('get/cois-error').catch()
        .then();
    }
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emailData]);

  return (
    <>
      { !emailData && (
        <div className='coi-warning-container'>
          <div className='heading-container d-flex justify-content-start'>
            <ArrowBackIcon className='back-icon' onClick={(): void => { window.history.back(); }} />
            {' '}
            <p className='heading'>Deficient Certifications</p>
          </div>
          <div className='certificates'>
            {coisErrors?.map((item) => item.errors.length > 0 && (
              <div className='card'>
                <div className='title'>{item.insured}</div>
                <div className='rows'>

                  {item.errors.map((error) => (
                    <div className='warning-row'>
                      <div className='alert-sign'>
                        <i className='fas fa-exclamation-triangle' />
                      </div>
                      <div className='desc pt-2'>{error.error_text}</div>
                    </div>
                  ))}
                </div>
                <div className='bottom-line'>

                  <div className='button d-flex'>
                    <PrimayButton onClick={(): void => {
                      setEmailData(item);
                    }}
                    >
                      Send

                    </PrimayButton>
                  </div>
                  {item.sent_notes && <p>Notice Sent.</p> }

                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {emailData && <EmailTemplate emailData={emailData} setEmailData={(): void => { setEmailData(null); }} /> }
    </>
  );
}
