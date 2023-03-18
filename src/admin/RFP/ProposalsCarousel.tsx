/* eslint-disable no-nested-ternary */

import moment from 'moment';
import React, { useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import type { RFPProposal, RFPProposalQuestion } from './types';

interface IProps {
  rfpProposalData: RFPProposal[];
  questions: RFPProposalQuestion[];
}

function BackArrow(): JSX.Element {
  return (
    <svg width='6' height='12' viewBox='0 0 6 12' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path d='M5.01562 0.984375V11.0156L0 6L5.01562 0.984375Z' fill='#212121' fillOpacity='0.6' />
    </svg>
  );
}

function ForwardArrow(): JSX.Element {
  return (
    <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path d='M9.98438 17.0156L9.98438 6.98438L15 12L9.98438 17.0156Z' fill='url(#paint0_linear_5137_95729)' />
      <defs>
        <linearGradient id='paint0_linear_5137_95729' x1='24' y1='24' x2='24' y2='0' gradientUnits='userSpaceOnUse'>
          <stop stopColor='#00A4AB' />
          <stop offset='1' stopColor='#00CFA1' />
        </linearGradient>
      </defs>
    </svg>
  );
}

function ProposalsCarousel(props: IProps): JSX.Element {
  const { rfpProposalData, questions } = props;
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextOdd = (): void => {
    if (currentSlide !== (rfpProposalData.length * 1.5) - 3) {
      if (currentSlide === 0) {
        setCurrentSlide(currentSlide + 1.5);
      } else {
        setCurrentSlide(currentSlide + 1);
      }
    }
  };

  const next = (): void => {
    if (currentSlide !== (rfpProposalData.length * 1.5) - 3) {
      setCurrentSlide(currentSlide + 1.5);
    }
  };

  const prevOdd = (): void => {
    if (currentSlide === (rfpProposalData.length * 1.5) - 3.5) {
      setCurrentSlide(currentSlide - 0.5);
    } else {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const prev = (): void => {
    setCurrentSlide(currentSlide - 1.5);
  };

  const updateCurrentSlide = (index: number): void => {
    if (currentSlide !== index) {
      setCurrentSlide(index);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'row-reverse', marginTop: '40px' }}>
        {rfpProposalData.length > 1 && (
          <>
            {rfpProposalData.length % 2 === 0 ? (
              <>
                <div style={{ marginTop: '1px' }} aria-hidden='true' onClick={(): void => { next(); }}><ForwardArrow /></div>
                <div aria-hidden='true' onClick={(): void => { prev(); }}><BackArrow /></div>
              </>
            ) : (
              <>
                <div style={{ marginTop: '1px' }} aria-hidden='true' onClick={(): void => { nextOdd(); }}><ForwardArrow /></div>
                <div aria-hidden='true' onClick={(): void => { prevOdd(); }}><BackArrow /></div>
              </>
            )}
            <div />
          </>
        )}
      </div>
      <div className='bottomDiv'>
        <div className='width-33' style={{ position: 'relative', top: '2px' }}>
          <p className='border-botttom' style={{ borderTop: 'none' }}>Vendor</p>
          <p className='border-botttom'>Price</p>
          <p className='border-botttom'>Contacts</p>
          {questions.map((item) => (
            item.field_type !== 'signature'
              ? item.field_type === 'survey'
                ? item.survey_questions.map((q) => (
                  <p key={q.id} className='border-botttom'>{q.question}</p>
                ))
                : <p key={item.id} className='border-botttom'>{item.label}</p> : null
          ))}
        </div>
        <div className='width-66'>
          {rfpProposalData.length > 1
            ? (
              <Carousel
                showIndicators={false}
                //   show={2}
                showArrows
                centerMode
                centerSlidePercentage={50}
                showStatus={false}
                emulateTouch
                selectedItem={currentSlide}
                onChange={updateCurrentSlide}
              >
                {
                  rfpProposalData.map((item, index) => (
                    <div key={item.id} style={rfpProposalData.length % 2 === 0 && currentSlide === (index * 1.5) ? { borderLeft: '1px solid #E4E4E4', borderTop: '2px solid #00CFA1', boxSizing: 'border-box' } : rfpProposalData.length % 2 === 1 && (currentSlide === (index === 0 ? index : index + 0.5)) ? { borderLeft: '1px solid #E4E4E4', borderTop: '2px solid #00CFA1', boxSizing: 'border-box' } : { borderLeft: '1px solid #E4E4E4', position: 'relative', top: '2px' }}>
                      <p className='border-botttom' style={{ fontSize: '20px', color: '#212121', borderTop: 'none' }}>{item.vendor}</p>
                      <p className='border-botttom' style={{ fontSize: '24px', color: '#00CFA1' }}>
                        <sup style={{ fontSize: '13px' }}>$</sup>
                        {item.total_amount}
                      </p>
                      <p className='border-botttom' style={{ padding: '10px 0px' }}>
                        {item.contact_name}
                        <br />
                        {' '}
                        <span style={{ fontSize: '12px' }}>{item.email}</span>
                      </p>
                      {questions.map((val) => item.proposal_answers.map((v) => (
                        val.field_type !== 'signature'
                          ? val.id === v.rfp_question
                            ? v.file != null
                              ? <p key={v.id} className='border-botttom'><a style={{ color: '#4DC6FA' }} href={`${process.env.REACT_APP_IMAGE_URL}${v.file}`}>{v.filename}</a></p> : v.question === 'Day'
                                ? <p key={v.id} className='border-botttom'>{moment(new Date(`${v.answer}T00:00:00`)).format('MM/DD/YYYY')}</p>
                                : <p key={v.id} className='border-botttom'>{v.answer}</p>
                            : null : null
                      )))}
                    </div>
                  ))
                }
              </Carousel>
            )
            : rfpProposalData.map((item) => (
              <div key={item.id} style={{ position: 'relative', top: '2px' }}>
                <p className='border-botttom' style={{ fontSize: '20px', color: '#212121', borderTop: 'none' }}>{item.vendor}</p>
                <p className='border-botttom' style={{ fontSize: '24px', color: '#00CFA1' }}>
                  <sup style={{ fontSize: '13px' }}>$</sup>
                  {item.total_amount}
                </p>
                <p className='border-botttom' style={{ padding: '10px 0px' }}>
                  {item.contact_name}
                  <br />
                  {' '}
                  <span style={{ fontSize: '12px' }}>{item.email}</span>
                </p>
                {questions.map((val) => item.proposal_answers.map((v) => (
                  val.field_type !== 'signature'
                    ? val.id === v.rfp_question
                      ? v.file != null
                        ? <p key={v.id} className='border-botttom'><a style={{ color: '#4DC6FA' }} href={`${process.env.REACT_APP_IMAGE_URL}${v.file}`}>{v.filename}</a></p>
                        : <p key={v.id} className='border-botttom'>{v.answer}</p>
                      : null : null
                )))}
              </div>
            ))}
        </div>
      </div>

    </div>
  );
}

export default ProposalsCarousel;
