import React, { useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function VerifyAccount(): JSX.Element {
  const { token } = useParams();
  const [confirmationText, setConfirmationText] = useState('');
  const [userTokenError, setUserTokenError] = useState('');

  const { mutate } = useMutation(async () => axios({
    url: 'api/auth-users/check-account/',
    method: 'POST',
    data: { token },
  }), {
    onSuccess: () => {
      setConfirmationText('Your email is verified. You can login with your account.');
      setUserTokenError('');
    },
    onError: () => {
      setUserTokenError('Email Access token expired or wrong.');
      setConfirmationText('');
    },
  });

  useEffect(() => {
    if (token != null) {
      mutate();
    }
  }, [mutate, token]);

  return (
    <div>
      <main className='auth-pages'>
        <div className='container'>
          <section className='auth-content'>
            {(confirmationText === '' && userTokenError === '')
            && (
              <h3>
                Waiting for Verification...
              </h3>
            )}

            {confirmationText !== ''
            && (
              <div>
                <h2 className='auth-title fw-bolder'>Email Verified.</h2>
                <h5 className='auth-subtitle'>
                  <div>
                    {confirmationText}
                  </div>
                </h5>
              </div>
            )}

            {userTokenError !== ''
            && (
              <div className='color-black'>
                <h2 className='auth-title fw-bolder'>Email Verification Failed.</h2>
                <h5 className='auth-subtitle'>
                  Looks like the email verification token is invalid. Try accessing the link for mail again.
                </h5>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
