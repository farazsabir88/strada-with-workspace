/* eslint-disable @typescript-eslint/no-unsafe-argument */
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import './_accountSetting.scss';
import { useMutation } from 'react-query';
import { useDispatch } from 'react-redux';
import { useSnackbar } from 'notistack';
import {
  Box, Backdrop, Modal, Typography,
} from '@mui/material';
import axios from 'axios';
import { FilePond, registerPlugin } from 'react-filepond';
import type {
  FilePondFile, FilePondServerConfigProps,
} from 'filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginImageCrop from 'filepond-plugin-image-crop';
import PrimayButton from 'shared-components/components/PrimayButton';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import StradaLoader from 'shared-components/components/StradaLoader';
import { setLogin } from 'client/login/store';
import type { Iuser } from 'types';

interface Iprops {
  user: Iuser;
}

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview, FilePondPluginImageCrop);
const style = {
  position: 'absolute' as const,
  top: '38%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 3,
};

interface FileProps extends FilePondFile, FilePondServerConfigProps {

}

export default function PictureUpdate(props: Iprops): JSX.Element {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [files, setFiles] = React.useState<FileProps[]>([]);
  const [open, setOpen] = React.useState(false);
  const handleOpen: () => void = () => { setOpen(true); };
  const handleClose: () => void = () => { setOpen(false); };
  const { user } = props;

  const cancelButton: () => void = () => {
    setOpen(false);
    setFiles([]);
  };

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const handleupload = async () => {
    cancelButton();
    const formData = new FormData();
    formData.append('avatar', files[0].file);
    return axios({
      url: `api/users/${user.id}/`,
      method: 'patch',
      data: formData,
    });
  };
  const { mutate, isLoading } = useMutation(handleupload, {
    onSuccess: (data) => {
      enqueueSnackbar('Picture Updated Succesfully!');

      dispatch(setLogin({ ...user, ...data.data }));
    },
  });
  return (
    <>
      <StradaLoader open={isLoading} />
      <div>
        <Stack direction='row' mt={{ lg: 7, md: 6, sm: 4 }} className='profile-wrapper align-items-center'>

          <Avatar alt={user.first_name[0]} src={`${process.env.REACT_APP_IMAGE_URL}${user.avatar}`} className='profile-avatar' />

          <Box component='div' className='update-profile-button'>
            <PrimayButton onClick={handleOpen}>  Update New Picture</PrimayButton>
            {' '}
          </Box>
          <Typography component='div' className='delete-desc' />
        </Stack>
      </div>
      <div>

        <Modal
          aria-labelledby='transition-modal-title'
          aria-describedby='transition-modal-description'
          open={open}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >

          <Box sx={style}>

            <Typography sx={{ fontSize: '20px', margin: '10px 0px 10px 0' }}>Upload Profile Picture</Typography>
            <FilePond
              files={[...files.map((singleFile: FilePondFile) => singleFile.file)]}
              allowImageCrop
              allowMultiple={false}
              imageCropAspectRatio='1:1'
              onupdatefiles={setFiles}
              labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
            />

            <div className='d-flex justify-content-end'>
              <Typography sx={{ cursor: 'pointer', marginTop: '8px' }} onClick={cancelButton}>Cancel</Typography>
                &nbsp;&nbsp;&nbsp;
              <Typography sx={{ color: '#00CFA1', cursor: 'pointer', marginTop: '8px' }} onClick={(): void => { mutate(); }}>Upload</Typography>
            </div>

          </Box>

        </Modal>

      </div>
    </>
  );
}
