/* eslint-disable react/destructuring-assignment */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import type { RenderZoomInProps, RenderZoomOutProps } from '@react-pdf-viewer/zoom';
import { zoomPlugin } from '@react-pdf-viewer/zoom';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/zoom/lib/styles/index.css';
import './_editContent.scss';

interface Iprops {
  docURL: string | undefined;
}
export default function PinchZoom(props: Iprops): JSX.Element {
  const { docURL } = props;

  const zoomPluginInstance = zoomPlugin();
  const { ZoomIn, ZoomOut } = zoomPluginInstance;
  return (
    <div style={{ width: '100%', height: '100%' }} className='pdf-dialog-edit-form'>

      <div className='pdf-container'>

        <div
          className='zoom-container'
        >
          <div style={{ padding: '0px 2px' }}>
            <ZoomOut>
              {(prop: RenderZoomOutProps): React.ReactNode => (
                <div
                  className='zoom-btn-out'
                  onClick={prop.onClick}
                >
                  -
                </div>
              )}
            </ZoomOut>
          </div>

          <div style={{ padding: '0px 2px' }}>
            <ZoomIn>
              {(prop: RenderZoomInProps): React.ReactElement => (
                <div
                  className='zoom-btn-in'
                  onClick={prop.onClick}
                >
                  +
                </div>
              )}
            </ZoomIn>
          </div>
        </div>
        <Worker workerUrl='https://unpkg.com/pdfjs-dist@3.1.81/build/pdf.worker.min.js'>
          <Viewer plugins={[zoomPluginInstance]} fileUrl={`${process.env.REACT_APP_IMAGE_URL}/api/${docURL}`} />
        </Worker>
      </div>
    </div>
  );
}
