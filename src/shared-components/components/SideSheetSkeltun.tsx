/* eslint-disable react/jsx-props-no-spreading */

import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import type { SlideProps } from '@mui/material/Slide';
import Slide from '@mui/material/Slide';
import { makeStyles } from '@mui/styles';
import DialogActions from '@mui/material/DialogActions';

const useStyles = makeStyles(() => ({
  scrollPaper: {
    justifyContent: 'flex-end',
  },
}));
interface IProps {
  open: boolean;
  handleClose: () => void;
}

function Transition(props: SlideProps): JSX.Element {
  return <Slide direction='left' {...props} />;
}

export default function SideSheetSkeltun({ open, handleClose }: IProps): JSX.Element {
  const classes = useStyles();
  return (
    <div
      className='relative'
      onMouseEnter={(e): void => {
        e.stopPropagation();
        e.preventDefault();
      }}
      onMouseLeave={(e): void => {
        e.stopPropagation();
        e.preventDefault();
      }}
    >

      <Dialog
        fullScreen
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby='alert-dialog-slide-title'
        aria-describedby='alert-dialog-slide-description'
        classes={classes}
        PaperProps={{
          elevation: 0,
          style: {
            width: '600px',
          },
        }}
      >
        <DialogTitle>
          <div>
            <p> Term & Condition </p>
          </div>
        </DialogTitle>

        <DialogContent />

        <DialogActions>

          dfsf
        </DialogActions>

      </Dialog>

    </div>
  );
}
