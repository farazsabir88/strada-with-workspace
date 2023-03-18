import React from 'react';
import {
  Routes, Route, Navigate, useLocation,
} from 'react-router-dom';
import VendorSchedule from 'admin/buildingSection/budget-calendar/VendorSchedule';
import RFPSchedulingForm from 'admin/buildingSection/budget-calendar/EventSchedule/RFPSchedulingForm';
import Home from './home';
import Dummy from './dummy';
import Login from './login';
import ForgetPassword from './forgetPassword';
import Signup from './signup';
import RequestDemo from './requestDemo';
import ContactUs from './contactUs';
import LearnMore from './learnMore';
import Navbar from './navbar';
import PrivacyPolicy from './privacyPolicy';
import TermsConditions from './termsConditions';
import VerifyAccount from './verifyAccount';
import AccountInvite from './accountInvite';
import ResetPassword from './resetPassword';

export default function Router(): JSX.Element {
  const location = useLocation();
  return (
    <div>
      {(!location.pathname.includes('email-vendor-to-schedule') && !location.pathname.includes('rfp-form')) && <Navbar />}
      <Routes>

        <Route path='/' element={<Home />} />
        <Route path='/signin' element={<Login />} />
        <Route path='/forgot-password' element={<ForgetPassword />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/check-account/:token' element={<VerifyAccount />} />
        <Route path='/reset-password/:resetKey' element={<ResetPassword />} />
        <Route path='/confirm-account/:token/:inviteId' element={<AccountInvite />} />
        <Route path='/requestdemo' element={<RequestDemo />} />
        <Route path='/contact-us' element={<ContactUs />} />
        <Route path='/dummy' element={<Dummy />} />
        <Route path='/learn-more' element={<LearnMore />} />
        <Route path='/privacy-policy' element={<PrivacyPolicy />} />
        <Route path='/terms-and-conditions' element={<TermsConditions />} />
        <Route path='/email-vendor-to-schedule/:eventId' element={<VendorSchedule />} />
        <Route path='/rfp-form/:formcode' element={<RFPSchedulingForm />} />
        <Route path='*' element={<Navigate to='/signin' replace />} />

      </Routes>
    </div>
  );
}
