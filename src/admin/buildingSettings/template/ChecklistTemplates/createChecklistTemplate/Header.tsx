import React, { useState, useEffect } from 'react';
import {
  Button,
} from '@mui/material';
import './_create-checklist-template.scss';
import InputField from 'shared-components/inputs/InputField';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';

interface IHeaderProps {
  checklistTemplateName: string;
  templateName: string;
  setTemplateName: (value: string) => void;
  addChanges: boolean;
  isBackButtonClicked: boolean;
  setIsBackButtonClicked: (value: boolean) => void;
  onBackButtonEvent: () => void;
}

function TickArrowIcon(): JSX.Element {
  return (
    <svg width='40' height='40' viewBox='0 0 40 40' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <circle cx='20' cy='20' r='20' fill='black' fillOpacity='0.04' />
      <path d='M17 24.1719L27.5938 13.5781L29 14.9844L17 26.9844L11.4219 21.4062L12.8281 20L17 24.1719Z' fill='#212121' fillOpacity='0.6' />
    </svg>
  );
}

export default function Header(props: IHeaderProps): JSX.Element {
  const {
    checklistTemplateName, templateName, setTemplateName, addChanges, isBackButtonClicked, setIsBackButtonClicked, onBackButtonEvent,
  } = props;
  const [isRenameTemplate, setIsRenameTemplate] = useState<boolean>(false);
  const [changeTemplateName, setChangeTemplateName] = useState<boolean>(false);

  useEffect(() => {
    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', onBackButtonEvent);
    return () => {
      window.removeEventListener('popstate', onBackButtonEvent);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBackButtonClicked]);

  const onCancelClick = (): void => {
    setIsRenameTemplate(false);
    setChangeTemplateName(false);
  };
  const onTickClick = (): void => {
    setIsRenameTemplate(false);
    setChangeTemplateName(true);
  };

  const onBackArrowClick = (): void => {
    if (addChanges) {
      window.history.back();
    } else {
      setIsBackButtonClicked(true);
      window.history.back();
    }
  };

  return (
    <div className='header-wrap'>
      <div className='header-left-div'>
        <div className='arrow-back-div' aria-hidden='true' onClick={(): void => { onBackArrowClick(); }}><ArrowBackIcon /></div>
        {!isRenameTemplate ? (
          <>
            {changeTemplateName ? <p>{templateName}</p> : <p>{checklistTemplateName}</p>}
            <div className='arrow-back-div' aria-hidden='true' onClick={(): void => { setIsRenameTemplate(true); }}><EditIcon /></div>
          </>
        ) : (
          <>
            <InputField
              name='template_name'
              type='text'
              value={templateName}
              onChange={(event): void => { setTemplateName(event.target.value); }}
            />
            <div aria-hidden='true' onClick={(): void => { onTickClick(); }} style={{ margin: '0px 8px', cursor: 'pointer' }}><TickArrowIcon /></div>
            <div aria-hidden='true' className='cursor-pointer' onClick={(): void => { onCancelClick(); }}><CancelIcon /></div>

          </>
        ) }
      </div>
      <Button
        className='button'
        variant='contained'
        color='primary'
        type='submit'
        style={{ textTransform: 'inherit', color: 'white', background: '#00CFA1' }}
      >
        Save Changes
      </Button>
    </div>
  );
}
