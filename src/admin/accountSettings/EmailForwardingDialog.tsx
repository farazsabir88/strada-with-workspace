import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import makeStyles from '@mui/styles/makeStyles';
import StandardButton from 'shared-components/components/StandardButton';
import PrimayButton from 'shared-components/components/PrimayButton';
import type { IEmilForwardingIProps } from './types';

const useStyles = makeStyles(() => ({
  dialogTitle: {
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '20px',
    lineHeight: '24px',
    letterSpacing: '0.15px',
    color: 'rgba(33, 33, 33, 0.87)',
    mixBlendMode: 'normal',
  },
  contextText: {
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: '16px',
    lineHeight: '24px',
    letterSpacing: '0.5px',
    color: 'rgba(33, 33, 33, 0.6)',
    mixBlendMode: 'normal',
    marginBottom: '39px',
  },
  primaryBtnBox: {
    width: '90px',
    height: '36px',
    marginLeft: '15px',
  },
}));

export default function EmailForwardingDialog(props: IEmilForwardingIProps): JSX.Element {
  const { open, handleClose, setIsForwardingEnabled } = props;
  const classes = useStyles();

  const handleTurnOn: () => void = () => {
    setIsForwardingEnabled(true);
    handleClose();
  };

  return (

    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
    >
      <DialogTitle className={classes.dialogTitle} id='alert-dialog-title'>
        Email forwarding
      </DialogTitle>
      <DialogContent>
        <DialogContentText className={classes.contextText} id='alert-dialog-description'>
          Turning on email forwarding will disconnect your Outlook or Gmail integration.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <StandardButton onClick={handleClose}> Cancel </StandardButton>
        <div className={classes.primaryBtnBox}>
          <PrimayButton onClick={handleTurnOn}> Turn on </PrimayButton>
        </div>

      </DialogActions>
    </Dialog>
  );
}
