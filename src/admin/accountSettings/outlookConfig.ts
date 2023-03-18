export const config = {
  appId: 'c777628d-d902-44c7-897d-55279719edd3',
  redirectUri: `${process.env.REACT_APP_BASE_URL}settings/account`,
  scopes: [
    'openid',
    'mail.Send',
    'Calendars.Read',
    'Calendars.ReadWrite',
    'User.Read',
    'Mail.Read',
  ],
};
