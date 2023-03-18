/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Autocomplete, Button } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient, useQuery } from 'react-query';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSelector } from 'react-redux';
import axios from 'axios';
import type { AxiosResponse } from 'axios';
import { useSnackbar } from 'notistack';
import SecondaryButton from 'shared-components/components/SecondaryButton';
import type { IFormValues } from 'formsTypes';
import type { RootState } from 'mainStore';
import type { IChartsOfAccountsForm } from 'admin/AdminFormTypes';
import HookTextField from 'shared-components/hooks/HookTextField';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import makeStyles from '@mui/styles/makeStyles';
import type { ICOIBuilding, IWorkspaceBuildingResponse } from 'admin/buildingSettings/vendorCOI/types';
import type { IAction, ICOAPayload } from './types';

const icon = <CheckBoxOutlineBlankIcon fontSize='small' />;
const checkedIcon = <CheckBoxIcon fontSize='small' />;

interface IAddGLModalProps {
  open: boolean;
  handleClose: () => void;
  action: IAction;
}

const glFormDefaultValues: IChartsOfAccountsForm = {
  gl_account: '',
  gl_code: '',
};

const glFormSchema = yup.object().shape({
  gl_account: yup.string().required('Please enter G/L account').matches(/^\s*\S[^]*$/, 'This field is required'),
  gl_code: yup.string().required('Please enter G/L code').matches(/^\s*\S[^]*$/, 'This field is required'),
});

const useStyles = makeStyles(() => ({
  dialog: {
    '& .MuiDialog-container': {
      '& .MuiPaper-root': {
        maxWidth: '550px',
        width: '550px',
      },

    },
  },
}));

export default function AddGLModal(props: IAddGLModalProps): JSX.Element {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const currentWorkspace = useSelector((state: RootState) => state.workspaces.currentWorkspace.currentWorkspace);
  const [allProperties, setAllProperties] = React.useState<boolean>(true);
  const [selectedProperties, setSelectedProperties] = React.useState<ICOIBuilding[]>([]);
  const [title, setTitle] = React.useState<string | undefined>();

  const {
    open, handleClose, action,
  } = props;

  const {
    control, handleSubmit, formState, setValue,
  } = useForm<IFormValues>({
    mode: 'onChange',
    defaultValues: glFormDefaultValues,
    resolver: yupResolver(glFormSchema),
  });

  const { errors } = formState;

  const handleReset = (): void => {
    setSelectedProperties([]);
    setAllProperties(true);
    setValue('gl_code', '');
    setValue('gl_account', '');
  };

  const onClose = (): void => {
    handleReset();
    handleClose();
  };

  const { data: workspacePropertiesList = [] } = useQuery(['get/builings-in-workspace', currentWorkspace], async () => axios({
    url: `api/filter/property/?workspace=${currentWorkspace.id}`,
    method: 'get',
  }), {
    select: (res: AxiosResponse<IWorkspaceBuildingResponse>) => res.data.detail,
  });

  const { mutate: createAccount, isLoading: creating } = useMutation(async (data: ICOAPayload) => axios({
    url: `/api/workspace-gl-code/?workspace=${currentWorkspace.id}`,
    method: 'POST',
    data,
  }), {
    onSuccess: async () => {
      await queryClient.invalidateQueries('get/chart_of_accounts').catch().then();
      onClose();
      enqueueSnackbar(`G/L code ${title} was saved`);
    },
    onError: () => {
      enqueueSnackbar('Creation Failed. Change code and try again.', { variant: 'error' });
    },
  });

  const { mutate: updateAccount, isLoading: updating } = useMutation(async ({ data, id }: { data: ICOAPayload; id: number | string }) => axios({
    url: `/api/workspace-gl-code/${id}/`,
    method: 'PATCH',
    data,
  }), {
    onSuccess: async () => {
      await queryClient.invalidateQueries('get/chart_of_accounts').catch().then();
      onClose();
      enqueueSnackbar(`G/L code ${title} was saved`);
    },
  });

  const onSubmit = (data: IChartsOfAccountsForm): void => {
    if (!allProperties && selectedProperties.length === 0) {
      enqueueSnackbar('Atleast 1 property is required.');
      return;
    }
    setTitle(data.gl_account);

    const payload = {
      ...data,
      building_access_all: allProperties,
      buildings: selectedProperties,
    };

    if (action.type === 'edit' && action.data !== undefined) {
      updateAccount({ data: payload, id: action.data.id });
    } else {
      createAccount(payload);
    }
  };

  React.useEffect(() => {
    if (action.type === 'edit' && action.data !== undefined) {
      setValue('gl_account', action.data.gl_account, { shouldDirty: true });
      setValue('gl_code', action.data.gl_code, { shouldDirty: true });
      if (action.data.allBuildings !== undefined) {
        setSelectedProperties(action.data.allBuildings);
      }
      setAllProperties(action.data.building_access_all);
    } else {
      handleReset();
    }
  }, [action, setValue]);

  const getPropertyValues = (list: ICOIBuilding[]): ICOIBuilding[] => {
    const result = list.filter((o1) => selectedProperties.some((o2) => o1.id === o2.id));
    return result;
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        className={classes.dialog}
      >
        <DialogTitle>
          <p className='gl-diloag-title'>
            {action.type === 'edit' ? 'Edit' : 'Add'}
            {' '}
            G/L Code
            {' '}
          </p>
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)} id='gl-form'>

            <HookTextField
              name='gl_code'
              label='G/L Code'
              errors={errors}
              control={control}
            />
            <HookTextField
              name='gl_account'
              label='Account Name'
              errors={errors}
              control={control}
            />
            <div className='event-duration-section'>
              <FormControl>
                <RadioGroup
                  aria-labelledby='demo-radio-buttons-group-label-099'
                  defaultValue={allProperties}
                  value={allProperties}
                  onChange={(): void => {
                    setAllProperties(!allProperties);
                    setSelectedProperties([]);
                  }}
                  name='radio-buttons-group-09878'
                >
                  <div className='fixed-durations'>
                    <FormControlLabel value control={<Radio />} label='All' />
                    <FormControlLabel value={false} control={<Radio />} label='Select' />
                  </div>
                </RadioGroup>
              </FormControl>
            </div>
            {!allProperties && (
              <div className='mt-3 mb-3'>
                <Autocomplete
                  multiple
                  id='checkboxes-tags-demo'
                  options={workspacePropertiesList}
                  value={getPropertyValues(workspacePropertiesList)}
                  disableCloseOnSelect
                  limitTags={2}
                  onChange={(event, newValue): void => {
                    setSelectedProperties(newValue);
                  }}
                  getOptionLabel={(option: ICOIBuilding): string => option.address}
                  // filterSelectedOptions
                  // getOptionSelected={(option, value): string => option.value === value.value}
                  renderOption={(prop, option, { selected }): JSX.Element => (
                    <li {...prop}>
                      <Checkbox
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        checked={selected}
                      // checked={!!selectedProperties.find((v) => v.address === option.address)}
                      />
                      {option.address}
                    </li>
                  )}
                  // style={{ width: 500 }}
                  renderInput={(params): JSX.Element => (
                    <TextField {...params} label='Apply for properties' placeholder='Type to filter options...' />
                  )}
                />
              </div>
            )}
          </form>
        </DialogContent>
        <DialogActions>
          <SecondaryButton className='secondary-btn-secondary' onClick={onClose} disabled={updating || creating}>Cancel</SecondaryButton>
          <Button variant='text' className='text-transform-none' form='gl-form' type='submit' disabled={updating || creating}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
