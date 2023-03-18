/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import type { TransitionProps } from '@mui/material/transitions';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  useLocation,
} from 'react-router-dom';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import type { RenderZoomInProps, RenderZoomOutProps } from '@react-pdf-viewer/zoom';
import { zoomPlugin } from '@react-pdf-viewer/zoom';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/zoom/lib/styles/index.css';

const Transition = React.forwardRef(
  (
    props: TransitionProps & {
      children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
  ) => <Slide direction='right' ref={ref} {...props} />,
);

export default function FullScreenDialog(): JSX.Element {
  const docUrl = useLocation().state as string;

  const zoomPluginInstance = zoomPlugin();
  const { ZoomIn, ZoomOut } = zoomPluginInstance;
  return (
    <div>
      <Dialog
        fullScreen
        open
        TransitionComponent={Transition}
        className='pdf-dialog-send-notice'
      >
        <div className='pdf-container'>
          <div className='close-btn text-end'>
            <ArrowBackIcon fontSize='medium' sx={{ color: 'white', cursor: 'pointer' }} onClick={(): void => { window.history.back(); }} />
            <p>{docUrl.replace('media/documents/cois/', '')}</p>
          </div>
          <div
            className='zoom-container'
          >
            <div style={{ padding: '0px 2px' }}>
              <ZoomOut>
                {(props: RenderZoomOutProps): React.ReactNode => (
                  <div
                    className='zoom-btn-out'
                    onClick={props.onClick}
                  >
                    -
                  </div>
                )}
              </ZoomOut>
            </div>

            <div style={{ padding: '0px 2px' }}>
              <ZoomIn>
                {(props: RenderZoomInProps): React.ReactElement => (
                  <div
                    className='zoom-btn-in'
                    onClick={props.onClick}
                  >
                    +
                  </div>
                )}
              </ZoomIn>
            </div>
          </div>
          <Worker workerUrl='https://unpkg.com/pdfjs-dist@3.1.81/build/pdf.worker.min.js'>
            <Viewer plugins={[zoomPluginInstance]} fileUrl={`${process.env.REACT_APP_IMAGE_URL}/api/${docUrl}`} />
          </Worker>
        </div>
      </Dialog>
    </div>
  );
}
