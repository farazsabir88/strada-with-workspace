/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-props-no-spreading */
import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import DeleteIcon from '@mui/icons-material/Delete';
import './_drag.scss';

interface NewFile extends File {
  preview: string;
}
interface Iprops {
  fileCallback: (file: NewFile) => void;
  isEditing: string | undefined;
  editingLogoUrl: string | undefined;
}

export default function DragDrop(props: Iprops): JSX.Element {
  const { fileCallback, isEditing, editingLogoUrl } = props;

  const [files, setFiles] = useState<NewFile[]>([]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': [],
    },
    onDrop: (acceptedFiles: File[]) => {
      setFiles(acceptedFiles.map((file) => Object.assign(file, {
        preview: URL.createObjectURL(file),
      })));
    },
  });
  useEffect(() => {
    if (files.length !== 0) { fileCallback(files[0]); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

  const thumbs = files.map((file: NewFile) => (
    <div className='thumb' key={file.name}>
      <div className='thumb-inner'>
        <img
          src={file.preview}
          alt='image234'
          className='img-style'
          onLoad={(): void => { URL.revokeObjectURL(file.preview); }}
        />
      </div>
    </div>
  ));

  useEffect(
    () => () => { files.forEach((file) => { URL.revokeObjectURL(file.preview); }); },
    [],
  );

  let withoutQoutesUrl = '';
  if (editingLogoUrl !== undefined) {
    withoutQoutesUrl = editingLogoUrl.replaceAll('"', '');
  }
  return (
    <section>
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <Box className='preview-container'>
          Drag and drop a logo for invoice here or click
          <p>Only .jpg or .png files. 500kb max file size</p>
        </Box>

      </div>
      {(files.length !== 0 || isEditing !== 'new') && (
        <aside className='d-flex justify-content-between align-items-center thumbs-container'>
          {thumbs}
          { (isEditing !== 'new' && files.length === 0)
           && (
             <div className='thumb'>
               <div className='thumb-inner'>
                 <img
                   src={`${process.env.REACT_APP_IMAGE_URL}${'/'}${withoutQoutesUrl}`}
                   alt='null'
                   className='img-style'
                 />
               </div>
             </div>
           )}
          <DeleteIcon className='thumb-icon' />
        </aside>
      )}
    </section>
  );
}
