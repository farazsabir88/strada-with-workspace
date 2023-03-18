/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable no-console */
/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { useSnackbar } from 'notistack';
import React, { useState, useEffect } from 'react';
import { useQueryClient, useMutation, useQuery } from 'react-query';
import type { AxiosResponse } from 'axios';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { FormBuilder } from '@formio/react';
import { Grid } from '@mui/material';
import { Editor } from '@tinymce/tinymce-react';
import { useForm } from 'react-hook-form';
import type { RootState } from 'mainStore';
import { useSelector } from 'react-redux';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import type { IFormValues } from 'formsTypes';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import 'formiojs/dist/formio.builder.min.css';
import HookTextField from 'shared-components/hooks/HookTextField';
import Switch from 'shared-components/inputs/Switch';
import InputField from 'shared-components/inputs/InputField';
import { decrypt } from 'shared-components/hooks/useEncryption';
import PrimayButton from 'shared-components/components/PrimayButton';
import StradaLoader from 'shared-components/components/StradaLoader';
import type {
  IQuestion, IData, IQuestionValues, IErrorResponse, IDetail,
} from '../types';

const defaultValues: IDetail = {
  add_footer: false,
  add_header: false,
  footer_text: '',
  header_text: '',
  property: NaN,
  questions: [],
  template_name: '',
};

function AddRFPForm(): JSX.Element {
  const { buildingId, tempId } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showHeader, setShowHeader] = useState<boolean | undefined>(false);
  const [showFooter, setShowFooter] = useState<boolean | undefined>(false);
  const [headerContent, setHeaderContent] = useState<string | undefined>('');
  const [footerContent, setFooterContent] = useState<string | undefined>('');
  const [formData, setFormData] = useState<IQuestion[] | undefined>([]);
  const [templateData, setTemplateData] = useState<IDetail>();

  const schema = yup.object().shape({
    template_name: yup.string().required('Name is required'),
  });
  const currentWorkspace = useSelector(
    (state: RootState) => state.workspaces.currentWorkspace.currentWorkspace,
  );

  const {
    control, formState, handleSubmit, setValue,
  } = useForm<IFormValues>({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });
  const { errors } = formState;

  const handleBack = (): void => {
    navigate('/workspace/settings/rfp-template');
  };

  const { isLoading } = useQuery(['get/rfp-template-data', tempId], async () => axios({
    url: `/api/rfp-template/${decrypt(tempId)}/`,
    method: 'GET',
  }), {
    onSuccess: (res: AxiosResponse<IDetail>) => {
      console.log('res', res);
      setTemplateData(res.data);
    },
    enabled: tempId !== 'new',
  });

  useEffect(() => {
    if (templateData !== undefined) {
      if (templateData.template_name !== undefined) {
        setValue('template_name', templateData.template_name);
      }

      setHeaderContent(templateData.header_text);
      setFooterContent(templateData.footer_text);
      setShowFooter(templateData.add_footer);
      setShowHeader(templateData.add_header);

      const { questions } = templateData;
      if (questions !== undefined && questions.length > 0) {
        for (let i = 0; i < questions?.length; i += 1) {
          questions[i] = { ...questions[i], type: questions[i].field_type, key: questions[i]?.id };

          if (questions[i].field_type === 'select' && questions[i].options !== undefined) {
            if (questions[i].options !== undefined) {
              const values = questions[i].options;
              const data: IData = { values };
              questions[i] = { ...questions[i], data };
            }
          }

          if (questions[i].field_type === 'survey') {
            const quest: IQuestionValues[] = [];
            const val: IQuestionValues[] = [];
            questions[i].options?.map((item) => {
              if (item.option_type === 'values') {
                const obj = {
                  label: item.label,
                  value: item.label,
                };
                val.push(obj);
              } else {
                const obj = {
                  label: item.label,
                  value: item.label,
                };
                quest.push(obj);
              }
              return item;
            });
            questions[i] = { ...questions[i], questions: quest, values: val };
          }
        }
        // console.log(questions);
        setFormData(questions);
      }
    }
  }, [setValue, templateData]);

  const { mutate: saveRFPForm } = useMutation(async (data: IDetail) => axios({
    url: `/api/rfp-template/?workspace=${currentWorkspace.id}`,
    method: 'POST',
    data,
  }), {
    onSuccess: async (): Promise<void> => {
      navigate('/workspace/settings/rfp-template');
      enqueueSnackbar('Form Added Successfully');
      await queryClient.invalidateQueries('get/rfp-template').then();
    },
    onError: (res: IErrorResponse) => {
      if (res.data.response.code === 'unique') {
        enqueueSnackbar('Template Name Already Exist');
      }
    },
  });

  const { mutate: updateRFPForm } = useMutation(async (payload: { id: number; data: IDetail }) => axios({
    url: `/api/rfp-template/${payload.id}/`,
    method: 'PATCH',
    data: payload.data,
  }), {
    onSuccess: async (): Promise<void> => {
      enqueueSnackbar('RFP Form Updated Successfully');
      await queryClient.invalidateQueries('get/rfp-template').then();
    },
    onError: (res: IErrorResponse) => {
      if (res.data.response.code === 'unique') {
        enqueueSnackbar('Template Name Already Exist');
      }
    },
  });

  const onSubmit = (data: IDetail): void => {
    const info = data;
    info.add_footer = showFooter;
    info.add_header = showHeader;
    info.header_text = headerContent;
    info.footer_text = footerContent;
    info.questions = formData;
    info.property = Number(decrypt(buildingId));

    if (tempId !== 'new') {
      updateRFPForm({ id: Number(decrypt(tempId)), data });
    } else {
      saveRFPForm(data);
    }
  };

  const changeHeaderContent: (e: string) => void = (e) => {
    setHeaderContent(e);
  };

  const changeFooterContent: (e: string) => void = (e) => {
    setFooterContent(e);
  };

  // const handleFormChange = (e: IRFPTemplate): void => {
  //   console.log(e);
  //   formData.push(e);
  //   setFormData([...formData]);
  // };

  // const elementExist = document.getElementsByClassName('component-edit-container');

  // setInterval(
  //   () => {
  //     const elementExist = document.getElementsByClassName('component-edit-container');
  //     if (elementExist.length > 0) {
  //       document.body.style.overflow = 'hidden';
  //     } else {
  //       document.body.style.overflow = 'auto';
  //     }
  //   },
  //   1000,
  // );

  return (
    <div style={{ display: 'flex' }} className='Main-purchase-orders'>
      <StradaLoader open={isLoading} />
      <Grid container className={`rfpHeader${showHeader !== undefined && showHeader && showFooter !== undefined && showFooter ? 'show' : (showHeader !== undefined && showHeader) || (showFooter !== undefined && showFooter) ? 'hidden' : ''}`}>
        <Grid item sm={4}>
          <div style={{ marginLeft: '40px' }}>
            <div className='heading-margin'>Form Components</div>
            <FormBuilder
              form={{
                display: 'form',
                components: formData,
              }}
              options={{
                builder: {
                  basic: {
                    components: {
                      number: false,
                      password: false,
                      radio: false,
                      selectboxes: false,
                      button: false,
                      survey: true,
                      file: true,
                      day: true,
                      currency: true,
                      signature: true,
                    },
                  },
                  advanced: false,
                  data: false,
                  premium: false,
                  layout: false,
                },
                editForm: {
                  textfield:
                      [{ key: 'display', label: 'Question', components: [{ key: 'description', ignore: true }, { key: 'displayMask', ignore: true }, { key: 'labelPosition', ignore: true }, { key: 'placeholder', ignore: true }, { key: 'tooltip', ignore: true }, { key: 'prefix', ignore: true }, { key: 'suffix', ignore: true }, { key: 'widget.type', ignore: true }, { key: 'inputMask', ignore: true }, { key: 'customClass', ignore: true }, { key: 'tabindex', ignore: true }, { key: 'autocomplete', ignore: true }, { key: 'hidden', ignore: true }, { key: 'hideLabel', ignore: true }, { key: 'showWordCount', ignore: true }, { key: 'showCharCount', ignore: true }, { key: 'allowMultipleMasks', ignore: true }, { key: 'mask', ignore: true }, { key: 'autofocus', ignore: true }, { key: 'spellcheck', ignore: true }, { key: 'disabled', ignore: true }, { key: 'tableView', ignore: true }, { key: 'modalEdit', ignore: true }] },
                        { key: 'validation', ignore: true },
                        { key: 'api', ignore: true },
                        { key: 'data', ignore: true },
                        { key: 'conditional', ignore: true },
                        { key: 'logic', ignore: true },
                        {
                          key: 'layout', ignore: true,
                        }],
                  textarea:
                      [{ key: 'display', label: 'Question', components: [{ key: 'description', ignore: true }, { key: 'displayMask', ignore: true }, { key: 'labelPosition', ignore: true }, { key: 'placeholder', ignore: true }, { key: 'tooltip', ignore: true }, { key: 'prefix', ignore: true }, { key: 'suffix', ignore: true }, { key: 'widget.type', ignore: true }, { key: 'inputMask', ignore: true }, { key: 'customClass', ignore: true }, { key: 'tabindex', ignore: true }, { key: 'autocomplete', ignore: true }, { key: 'hidden', ignore: true }, { key: 'hideLabel', ignore: true }, { key: 'showWordCount', ignore: true }, { key: 'showCharCount', ignore: true }, { key: 'allowMultipleMasks', ignore: true }, { key: 'mask', ignore: true }, { key: 'autofocus', ignore: true }, { key: 'spellcheck', ignore: true }, { key: 'disabled', ignore: true }, { key: 'tableView', ignore: true }, { key: 'modalEdit', ignore: true }, { key: 'editor', ignore: true }, { key: 'autoExpand', ignore: true }] },
                        { key: 'validation', ignore: true },
                        { key: 'api', ignore: true },
                        { key: 'data', ignore: true },
                        { key: 'conditional', ignore: true },
                        { key: 'logic', ignore: true },
                        {
                          key: 'layout', ignore: true,
                        }],
                  day:
                      [{ key: 'display', label: 'Question', components: [{ key: 'description', ignore: true }, { key: 'labelPosition', ignore: true }, { key: 'placeholder', ignore: true }, { key: 'tooltip', ignore: true }, { key: 'prefix', ignore: true }, { key: 'suffix', ignore: true }, { key: 'widget.type', ignore: true }, { key: 'inputMask', ignore: true }, { key: 'customClass', ignore: true }, { key: 'tabindex', ignore: true }, { key: 'autocomplete', ignore: true }, { key: 'hidden', ignore: true }, { key: 'hideLabel', ignore: true }, { key: 'showWordCount', ignore: true }, { key: 'showCharCount', ignore: true }, { key: 'allowMultipleMasks', ignore: true }, { key: 'mask', ignore: true }, { key: 'autofocus', ignore: true }, { key: 'spellcheck', ignore: true }, { key: 'disabled', ignore: true }, { key: 'tableView', ignore: true }, { key: 'modalEdit', ignore: true }, { key: 'hideInputLabels', ignore: true }, { key: 'inputsLabelPosition', ignore: true }, { key: 'useLocaleSettings', ignore: true }] },
                        { key: 'validation', ignore: true },
                        { key: 'api', ignore: true },
                        { key: 'data', ignore: true },
                        { key: 'conditional', ignore: true },
                        { key: 'logic', ignore: true },
                        { key: 'day', ignore: true },
                        { key: 'month', ignore: true },
                        { key: 'year', ignore: true },
                        {
                          key: 'layout', ignore: true,
                        }],
                  checkbox:
                      [{ key: 'display', label: 'Question', components: [{ key: 'description', ignore: true }, { key: 'labelPosition', ignore: true }, { key: 'placeholder', ignore: true }, { key: 'tooltip', ignore: true }, { key: 'prefix', ignore: true }, { key: 'suffix', ignore: true }, { key: 'widget.type', ignore: true }, { key: 'inputMask', ignore: true }, { key: 'customClass', ignore: true }, { key: 'tabindex', ignore: true }, { key: 'autocomplete', ignore: true }, { key: 'hidden', ignore: true }, { key: 'hideLabel', ignore: true }, { key: 'showWordCount', ignore: true }, { key: 'showCharCount', ignore: true }, { key: 'allowMultipleMasks', ignore: true }, { key: 'mask', ignore: true }, { key: 'autofocus', ignore: true }, { key: 'spellcheck', ignore: true }, { key: 'disabled', ignore: true }, { key: 'tableView', ignore: true }, { key: 'modalEdit', ignore: true }, { key: 'labelWidth', ignore: true }, { key: 'labelMargin', ignore: true }, { key: 'shortcut', ignore: true }, { key: 'inputType', ignore: true }] },
                        { key: 'validation', ignore: true },
                        { key: 'api', ignore: true },
                        { key: 'data', ignore: true },
                        { key: 'conditional', ignore: true },
                        { key: 'logic', ignore: true },
                        {
                          key: 'layout', ignore: true,
                        }],
                  currency:
                      [{ key: 'display', label: 'Question', components: [{ key: 'description', ignore: true }, { key: 'displayMask', ignore: true }, { key: 'labelPosition', ignore: true }, { key: 'placeholder', ignore: true }, { key: 'tooltip', ignore: true }, { key: 'prefix', ignore: true }, { key: 'suffix', ignore: true }, { key: 'widget.type', ignore: true }, { key: 'inputMask', ignore: true }, { key: 'customClass', ignore: true }, { key: 'tabindex', ignore: true }, { key: 'autocomplete', ignore: true }, { key: 'hidden', ignore: true }, { key: 'hideLabel', ignore: true }, { key: 'showWordCount', ignore: true }, { key: 'showCharCount', ignore: true }, { key: 'allowMultipleMasks', ignore: true }, { key: 'mask', ignore: true }, { key: 'autofocus', ignore: true }, { key: 'spellcheck', ignore: true }, { key: 'disabled', ignore: true }, { key: 'tableView', ignore: true }, { key: 'modalEdit', ignore: true }] },
                        { key: 'validation', ignore: true },
                        { key: 'api', ignore: true },
                        { key: 'data', ignore: true },
                        { key: 'conditional', ignore: true },
                        { key: 'logic', ignore: true },
                        {
                          key: 'layout', ignore: true,
                        }],
                  file:
                      [{ key: 'display', label: 'Question', components: [{ key: 'description', ignore: true }, { key: 'labelPosition', ignore: true }, { key: 'placeholder', ignore: true }, { key: 'tooltip', ignore: true }, { key: 'prefix', ignore: true }, { key: 'suffix', ignore: true }, { key: 'widget.type', ignore: true }, { key: 'inputMask', ignore: true }, { key: 'customClass', ignore: true }, { key: 'tabindex', ignore: true }, { key: 'autocomplete', ignore: true }, { key: 'hidden', ignore: true }, { key: 'hideLabel', ignore: true }, { key: 'showWordCount', ignore: true }, { key: 'showCharCount', ignore: true }, { key: 'allowMultipleMasks', ignore: true }, { key: 'mask', ignore: true }, { key: 'autofocus', ignore: true }, { key: 'spellcheck', ignore: true }, { key: 'disabled', ignore: true }, { key: 'tableView', ignore: true }, { key: 'modalEdit', ignore: true }] },
                        { key: 'validation', ignore: true },
                        { key: 'api', ignore: true },
                        { key: 'data', ignore: true },
                        { key: 'conditional', ignore: true },
                        { key: 'logic', ignore: true },
                        { key: 'file', ignore: true },
                        {
                          key: 'layout', ignore: true,
                        }],
                  select:
                      [{ key: 'display', label: 'Question', components: [{ key: 'description', ignore: true }, { key: 'labelPosition', ignore: true }, { key: 'placeholder', ignore: true }, { key: 'tooltip', ignore: true }, { key: 'prefix', ignore: true }, { key: 'suffix', ignore: true }, { key: 'widget.type', ignore: true }, { key: 'inputMask', ignore: true }, { key: 'customClass', ignore: true }, { key: 'tabindex', ignore: true }, { key: 'autocomplete', ignore: true }, { key: 'hidden', ignore: true }, { key: 'hideLabel', ignore: true }, { key: 'showWordCount', ignore: true }, { key: 'showCharCount', ignore: true }, { key: 'allowMultipleMasks', ignore: true }, { key: 'mask', ignore: true }, { key: 'autofocus', ignore: true }, { key: 'spellcheck', ignore: true }, { key: 'disabled', ignore: true }, { key: 'tableView', ignore: true }, { key: 'modalEdit', ignore: true }, { key: 'widget', ignore: true }, { key: 'uniqueOptions', ignore: true }] },
                        { key: 'validation', ignore: true },
                        { key: 'api', ignore: true },
                        { key: 'data', label: 'Answers', components: [{ key: 'multiple', ignore: true }, { key: 'dataSrc', ignore: true }, { key: 'defaultValue', ignore: true }, { key: 'dataType', ignore: true }, { key: 'idPath', ignore: true }, { key: 'template', ignore: true }, { key: 'refreshOn', ignore: true }, { key: 'refreshOnBlur', ignore: true }, { key: 'clearOnRefresh', ignore: true }, { key: 'searchEnabled', ignore: true }, { key: 'selectThreshold', ignore: true }, { key: 'readOnlyValue', ignore: true }, { key: 'customOptions', ignore: true }, { key: 'useExactSearch', ignore: true }, { key: 'persistent', ignore: true }, { key: 'protected', ignore: true }, { key: 'dbIndex', ignore: true }, { key: 'encrypted', ignore: true }, { key: 'clearOnHide', ignore: true }, { key: 'customDefaultValuePanel', ignore: true }, { key: 'calculateValuePanel', ignore: true }, { key: 'calculateServer', ignore: true }, { key: 'allowCalculateOverride', ignore: true }] },
                        { key: 'conditional', ignore: true },
                        { key: 'logic', ignore: true },
                        {
                          key: 'layout', ignore: true,
                        }],
                  survey:
                      [{ key: 'display', label: 'Question', components: [{ key: 'description', ignore: true }, { key: 'labelPosition', ignore: true }, { key: 'placeholder', ignore: true }, { key: 'tooltip', ignore: true }, { key: 'prefix', ignore: true }, { key: 'suffix', ignore: true }, { key: 'widget.type', ignore: true }, { key: 'inputMask', ignore: true }, { key: 'customClass', ignore: true }, { key: 'tabindex', ignore: true }, { key: 'autocomplete', ignore: true }, { key: 'hidden', ignore: true }, { key: 'hideLabel', ignore: true }, { key: 'showWordCount', ignore: true }, { key: 'showCharCount', ignore: true }, { key: 'allowMultipleMasks', ignore: true }, { key: 'mask', ignore: true }, { key: 'autofocus', ignore: true }, { key: 'spellcheck', ignore: true }, { key: 'disabled', ignore: true }, { key: 'tableView', ignore: true }, { key: 'modalEdit', ignore: true }] },
                        { key: 'validation', ignore: true },
                        { key: 'api', ignore: true },
                        { key: 'data', label: 'Answers', components: [{ key: 'defaultValue', ignore: true }, { key: 'persistent', ignore: true }, { key: 'protected', ignore: true }, { key: 'dbIndex', ignore: true }, { key: 'encrypted', ignore: true }, { key: 'redrawOn', ignore: true }, { key: 'clearOnHide', ignore: true }, { key: 'customDefaultValuePanel', ignore: true }, { key: 'calculateValuePanel', ignore: true }, { key: 'calculateServer', ignore: true }, { key: 'allowCalculateOverride', ignore: true }] },
                        { key: 'conditional', ignore: true },
                        { key: 'logic', ignore: true },
                        {
                          key: 'layout', ignore: true,
                        }],
                  signature:
                      [{ key: 'display', label: 'Question', components: [{ key: 'description', ignore: true }, { key: 'displayMask', ignore: true }, { key: 'labelPosition', ignore: true }, { key: 'placeholder', ignore: true }, { key: 'tooltip', ignore: true }, { key: 'prefix', ignore: true }, { key: 'suffix', ignore: true }, { key: 'widget.type', ignore: true }, { key: 'inputMask', ignore: true }, { key: 'customClass', ignore: true }, { key: 'tabindex', ignore: true }, { key: 'autocomplete', ignore: true }, { key: 'hidden', ignore: true }, { key: 'hideLabel', ignore: true }, { key: 'showWordCount', ignore: true }, { key: 'showCharCount', ignore: true }, { key: 'allowMultipleMasks', ignore: true }, { key: 'mask', ignore: true }, { key: 'autofocus', ignore: true }, { key: 'spellcheck', ignore: true }, { key: 'disabled', ignore: true }, { key: 'tableView', ignore: true }, { key: 'modalEdit', ignore: true }, { key: 'footer', ignore: true }, { key: 'width', ignore: true }, { key: 'height', ignore: true }, { key: 'backgroundColor', ignore: true }, { key: 'penColor', ignore: true }] },
                        { key: 'validation', ignore: true },
                        { key: 'api', ignore: true },
                        { key: 'data', ignore: true },
                        { key: 'conditional', ignore: true },
                        { key: 'logic', ignore: true },
                        {
                          key: 'layout', ignore: true,
                        }],
                },
              }}
              // onSaveComponent={handleFormChange} // no need for these
            />
          </div>
        </Grid>
        <Grid item sm={8}>
          <form onSubmit={handleSubmit(onSubmit)} className='template-body'>
            <Grid container>
              <Grid item sm={4}>
                <div className='flex-div margin-right-btn'>
                  <span aria-hidden='true' className='back-btn cursor-pointer' onClick={(): void => { handleBack(); }}>
                    <ArrowBackIcon className='back-icon' />
                  </span>
                  <p className='rfp-title'>
                    {tempId !== 'new' ? 'Edit ' : 'Add '}
                    RFP Form
                  </p>
                </div>
              </Grid>
              <Grid item sm={6} />
              <Grid item sm={2} className='btn-wrapper d-flex justify-content-end'>
                {/* <Button type='submit' variant='contained' className='text-transform-none' sx={{ color: 'white' }}> */}
                <PrimayButton type='submit'>
                  Save Form
                </PrimayButton>
              </Grid>
            </Grid>
            <div className='mt-3'>
              <HookTextField
                name='template_name'
                label='Form Name'
                control={control}
                errors={errors}
              />
              <div className='rfpSwitchDiv'>
                <Switch value={showHeader} checked={showHeader} onChange={(e, val): void => { setShowHeader(val); }} />

                <p>Add header info to this RFP</p>
              </div>
              {showHeader !== undefined && showHeader && (
                <div className='multi-input-wraps border-class' style={{ width: '90%', marginTop: '20px' }}>
                  <Editor
                    apiKey='1y7zut3pxyomlx5vhlj7wuh2q7r7sd4w8x7oevrxn05o07fq'
                    init={{
                      height: 300,
                      branding: false,
                      menubar: false,
                      skin: 'material-outline',
                      content_css: 'material-outline',
                      plugins: [
                        'advlist autolink lists link image charmap print preview anchor',
                        'searchreplace visualblocks code fullscreen',
                        'insertdatetime media table paste code help ',
                      ],
                      toolbar: 'undo redo | styleselect | fontsizeselect | backcolor | bold italic underline|  bullist numlist | outdent indent',
                      content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px;} ',
                    }}
                    value={headerContent}
                    onEditorChange={changeHeaderContent}
                  />
                </div>
              )}
              <div className='rfpSwitchDiv'>
                <Switch value={showFooter} checked={showFooter} onChange={(e, val): void => { setShowFooter(val); }} />

                <p>Add footer info to this RFP</p>
              </div>
              {showFooter !== undefined && showFooter && (
                <div className='multi-input-wraps border-class' style={{ width: '90%', marginTop: '20px' }}>
                  <Editor
                    apiKey='1y7zut3pxyomlx5vhlj7wuh2q7r7sd4w8x7oevrxn05o07fq'
                    init={{
                      height: 300,
                      branding: false,
                      menubar: false,
                      skin: 'material-outline',
                      content_css: 'material-outline',
                      plugins: [
                        'advlist autolink lists link image charmap print preview anchor',
                        'searchreplace visualblocks code fullscreen',
                        'insertdatetime media table paste code help ',
                      ],
                      toolbar: 'undo redo | styleselect | fontsizeselect | backcolor | bold italic underline|  bullist numlist | outdent indent',
                      content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px;} ',
                    }}
                    value={footerContent}
                    onEditorChange={changeFooterContent}
                  />
                </div>
              )}
              <p className='questions-p'>Form Questions</p>

              <InputField
                name='empty_data'
                label='Company Name'
                value=''
              />

              <InputField
                name='empty_data'
                label='Contact Name'
                value=''
              />

              <Grid container spacing={3}>
                <Grid item sm={4}>
                  <InputField
                    name='empty_data'
                    label='Phone'
                    value=''
                  />
                </Grid>
                <Grid item sm={8}>
                  <InputField
                    name='empty_data'
                    label='Email'
                    value=''
                  />
                </Grid>
              </Grid>
              <Grid container spacing={3}>
                <Grid item sm={4}>
                  <InputField
                    name='empty_data'
                    label='Total Price'
                    value=''
                  />
                </Grid>
                <Grid item sm={8} />
              </Grid>
            </div>

          </form>
        </Grid>
      </Grid>
    </div>
  );
}

export default AddRFPForm;
