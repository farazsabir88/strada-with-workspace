/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AppBar from '@mui/material/AppBar';
import Grid from '@mui/material/Grid';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Slide from '@mui/material/Slide';
import type { TransitionProps } from '@mui/material/transitions';
import './_editContent.scss';
import PrimayButton from 'shared-components/components/PrimayButton';
import type { IeditCOIs } from 'admin/AdminFormTypes';
import PinchZoomPan from './PinchZoomPan';
import EditForm from './EditForm';
// const EditForm = React.lazy(async () => import('./EditForm'));

const Transition = React.forwardRef((
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) => <Slide direction='up' ref={ref} {...props} />);

interface Iprops {
  handleClose: () => void;
  open: boolean;
  editData: IeditCOIs | undefined;
}

export default function FullScreenDialog(props: Iprops): JSX.Element {
  const { handleClose, open, editData } = props;
  return (
    <div>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        className='edit-dialog'
      >
        <AppBar className='edit-appbar-cois' elevation={1}>
          <Toolbar>
            <IconButton
              edge='start'
              color='inherit'
              onClick={handleClose}
              aria-label='close'
            >
              <ArrowBackIcon className='arrow-icon' />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant='h6' component='div' className='appbar-header'>
              Manual COI editing
            </Typography>
            <div><PrimayButton form='coi-edit-form' type='submit'>Save COI</PrimayButton></div>
          </Toolbar>
        </AppBar>

        <Grid container spacing={2}>
          <Grid item xs={6} md={6}>
            <PinchZoomPan docURL={editData?.file} />
          </Grid>

          <Grid item xs={6} md={6}>
            {/* <React.Suspense fallback={<div />}> */}
            <EditForm editData={editData} handleClose={handleClose} />
            {/* </React.Suspense> */}
          </Grid>
        </Grid>

      </Dialog>
    </div>
  );
}
