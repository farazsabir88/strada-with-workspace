/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/no-type-alias */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable no-nested-ternary */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation } from 'react-query';
import type { AxiosResponse } from 'axios';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import parse from 'html-react-parser';
import './_rfpscheduling.scss';
import InputField from 'shared-components/inputs/InputField';
import SelectInput from 'shared-components/inputs/SelectInput';
import type { SelectChangeEvent } from '@mui/material/Select';
import {
  Button,
  Checkbox, Table, TableBody, TableCell, TableHead, TableRow,
} from '@mui/material';
import SignatureCanvas from 'react-signature-canvas';
import makeStyles from '@mui/styles/makeStyles';
import StradaLoader from 'shared-components/components/StradaLoader';

function RefreshIcon(): JSX.Element {
  return (
    <svg
      width='22'
      height='18'
      viewBox='0 0 22 18'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M12 5.01562H13.5V9.23438L17.0156 11.3438L16.2656 12.5625L12 9.98438V5.01562ZM6.60938 2.625C8.39062 0.875 10.5156 0 12.9844 0C15.4531 0 17.5625 0.875 19.3125 2.625C21.0938 4.375 21.9844 6.5 21.9844 9C21.9844 11.5 21.0938 13.625 19.3125 15.375C17.5625 17.125 15.4531 18 12.9844 18C11.9531 18 10.8125 17.75 9.5625 17.25C8.34375 16.7188 7.375 16.0938 6.65625 15.375L8.0625 13.9219C9.4375 15.2969 11.0781 15.9844 12.9844 15.9844C14.9219 15.9844 16.5781 15.3125 17.9531 13.9688C19.3281 12.5938 20.0156 10.9375 20.0156 9C20.0156 7.0625 19.3281 5.42188 17.9531 4.07812C16.5781 2.70313 14.9219 2.01562 12.9844 2.01562C11.0469 2.01562 9.39062 2.70313 8.01562 4.07812C6.67188 5.42188 6 7.0625 6 9H9L4.96875 13.0312L4.875 12.8906L0.984375 9H3.98438C3.98438 6.5 4.85938 4.375 6.60938 2.625Z'
        fill='#212121'
        fillOpacity='0.6'
      />
    </svg>
  );
}

function TickIcon(): JSX.Element {
  return (
    <svg width='80' height='80' viewBox='0 0 80 80' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path d='M31.9375 60.0625L67.9375 24.0625L62.3125 18.25L31.9375 48.625L17.6875 34.375L12.0625 40L31.9375 60.0625ZM11.6875 11.875C19.5625 4 29 0.0625 40 0.0625C51 0.0625 60.375 4 68.125 11.875C76 19.625 79.9375 29 79.9375 40C79.9375 51 76 60.4375 68.125 68.3125C60.375 76.0625 51 79.9375 40 79.9375C29 79.9375 19.5625 76.0625 11.6875 68.3125C3.9375 60.4375 0.0625 51 0.0625 40C0.0625 29 3.9375 19.625 11.6875 11.875Z' fill='#00CFA1' />
    </svg>
  );
}

interface ISignature {
  file: string;
  name: string;
}

interface ISurvey {
  id: number | string;
  label: string;
  value: string;
}

type IResponse = Record<string, string>;

interface ISurveyResponse {
  answer: ISurvey[];
  question: ISurvey[];
  response: IResponse;
}

type ISignPad = Record<string, SignatureCanvas | null>;
type IExtraData = Record<string, ISignature | ISurveyResponse | boolean | string>;

interface IOptions {
  id: number;
  label: string;
  option_type: boolean | string;
  value: string;
  name: string;
}

interface IData {
  values: IOptions[] | undefined;
}

interface IQuestionValues {
  label?: string;
  tooltip?: string;
  value?: string;
}

interface IQuestion {
  field_type?: string;
  label?: string;
  type?: string;
  id?: number;
  data: IData;
  options?: IOptions[];
  rows?: number;
  questions?: IQuestionValues[];
  values?: IQuestionValues[];
  question?: ISurvey[];
  answer?: ISurvey[];
  response: Record<string, string>;
}

interface IRFPTemplates {
  add_footer?: boolean;
  add_header?: boolean;
  author?: number;
  author_name?: string;
  created_at?: string;
  default_check?: boolean;
  footer_text?: string;
  header_text?: string;
  id?: number;
  property: number | string;
  questions?: IQuestion[];
  template_name?: string;
  updated_at?: string;
  values?: IQuestion[];
}

interface IPayload {
  data: Record<string, ISignature | ISurveyResponse | boolean | string>;
  extraFieldsData: Record<string, ISignature | ISurveyResponse | boolean | string>;
  form_code: string | undefined;
  rfp: number | undefined;
}

const useStyles = makeStyles(() => ({
  sss: {
    '& .MuiSelect-outlined': {
      border: '1px solid rgb(226, 226, 225)',

    },
    '& .MuiOutlinedInput-notchedOutline': {
      border: 'none',
    },
  },
  nolabelfields: {
    '& .MuiFilledInput-root': {
      padding: '0',
      '& .MuiFilledInput-input': {
        padding: '16px',
      },
    },
    '& .MuiSelect-select': {
      textAlign: 'left',
    },
  },
  nolabelcurrencyfields: {
    '& .MuiFilledInput-root': {
      padding: '0',
      '& .MuiFilledInput-input': {
        padding: '16px 16px 16px 5px',
      },
    },
  },
}));

export default function RFPSchedulingForm(): JSX.Element {
  const { formcode } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const [formData, setFormData] = useState<IRFPTemplates>();
  const [rfpId, setRfpId] = useState<number>();
  const [fieldsData, setFieldsData] = useState<IExtraData>({});
  const signPad: ISignPad = {};
  const classes = useStyles();
  const [formError, setFormError] = useState<boolean>(false);
  const [successPopup, setSuccessPopup] = useState<boolean>(false);

  function StartDollerSign(): JSX.Element {
    return <div className='start-doller-sign mt-0 mb-0 me-0 ms-3'>$</div>;
  }

  useEffect(() => {
    document.body.style.backgroundColor = '#ECEFF1';
    document.body.style.scrollBehavior = 'smooth';
  }, []);

  const { mutate: getFormData } = useMutation(async () => axios({
    url: 'api/rfp/form/',
    method: 'POST',
    data: { form_code: formcode },
  }), {
    onSuccess: (res: AxiosResponse<IRFPTemplates>) => {
      setRfpId(res.data.id);
      if (res.data.questions !== undefined && res.data.questions.length > 0) {
        let { data } = res;
        const { questions } = data;
        let questionData = questions;
        questionData = questionData?.map((ques) => {
          if (ques.field_type === 'select') {
            let { options } = ques;
            const optionsUpdated = options?.map((opt) => {
              const obj = { ...opt, name: opt.label };
              return obj;
            });
            options = optionsUpdated;
            ques = { ...ques, options };
            if (ques.id !== undefined) {
              fieldsData[ques.id] = '';
              setFieldsData({ ...fieldsData });
            }
          } else if (ques.field_type === 'survey') {
            let { options } = ques;
            const surveyQues: ISurvey[] = [];
            const surveyAns: ISurvey[] = [];
            const surveyRes: IResponse = {};
            const optionsUpdated = options?.map((opt) => {
              if (opt.option_type === 'questions') {
                const obj = {
                  id: opt.label,
                  label: opt.label,
                  value: opt.value,
                };
                surveyQues.push(obj);
                surveyRes[opt.label] = '';
              } else {
                const obj = {
                  id: opt.label,
                  label: opt.label,
                  value: opt.value,
                };
                surveyAns.push(obj);
              }
              return opt;
            });
            options = optionsUpdated;
            ques = {
              ...ques, options, question: surveyQues, answer: surveyAns, response: surveyRes,
            };

            if (ques.id !== undefined) {
              fieldsData[ques.id] = { question: surveyQues, answer: surveyAns, response: surveyRes };
              setFieldsData({ ...fieldsData });
            }
          } else if (ques.field_type === 'signature') {
            if (ques.id !== undefined) {
              signPad[ques.id] = null;
              fieldsData[ques.id] = '';
              setFieldsData({ ...fieldsData });
            }
          } else if (ques.id !== undefined) {
            fieldsData[ques.id] = '';
            setFieldsData({ ...fieldsData });
          }
          return ques;
        });
        data = { ...data, questions: questionData };
        setFormData(data);
      }
      //  else {
      //   setFormError(true);
      // }
    },
    onError: () => {
      setFormError(true);
      enqueueSnackbar('Error.');
    },
  });

  useEffect(() => {
    if (formcode != null) {
      getFormData();
    }
  }, [formcode]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (e: any): void => {
    const { name, value } = e.target;
    if (e.target.type === 'checkbox') {
      setFieldsData({ ...fieldsData, [name]: e.target.checked });
    } else {
      setFieldsData({ ...fieldsData, [name]: value });
    }
  };

  const file2Base64 = async (file: File): Promise<string> => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (): void => {
      if (reader.result !== null && typeof reader.result === 'string') {
        resolve(reader.result.toString() || '');
      }
    };
    reader.onerror = (error): void => { reject(error); };
  });

  const fileHandler = async (e: React.ChangeEvent<HTMLInputElement>): Promise<string | undefined> => {
    const targetName = e.target.name;
    const file = e.target.files?.[0];
    if (file !== undefined) {
      const base64 = await file2Base64(file);
      setFieldsData({ ...fieldsData, [targetName]: { name: file.name, file: base64 } });
    }
    return file?.name;
  };

  const { mutate: uploadRFPProposal, isLoading } = useMutation(async (data: IPayload) => axios({
    url: 'api/rfp/proposal/',
    method: 'POST',
    data,
  }), {
    onSuccess: () => {
      setSuccessPopup(true);
    },
    onError: () => {
      enqueueSnackbar('Error in submission.');
    },
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (typeof fieldsData.email === 'string') {
      const isEmailValid = /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i.exec(fieldsData.email);
      if (!isEmailValid) {
        enqueueSnackbar('Email is not valid!');
        return;
      }
    }

    let count = 0;
    Object.keys(signPad).map((item) => {
      if (fieldsData[item] === '') {
        enqueueSnackbar('Signature is Required');
        count += 1;
      }
      return item;
    });

    if (count === 0) {
      const data = {
        company_name: fieldsData.company_name,
        contact_name: fieldsData.contact_name,
        email: fieldsData.email,
        phone: fieldsData.phone,
        total_amount: fieldsData.total_amount,
      };

      delete fieldsData.company_name;
      delete fieldsData.contact_name;
      delete fieldsData.email;
      delete fieldsData.phone;
      delete fieldsData.total_amount;

      const payload = {
        rfp: rfpId, data, extraFieldsData: { ...fieldsData }, form_code: formcode,
      };
      uploadRFPProposal(payload);
    }
  };

  return (
    <div>
      <StradaLoader open={isLoading} message='Submitting...' />
      <main className='auth-pages' style={{ marginTop: '0px', backgroundColor: '#ECEFF1', height: '100%' }}>
        <div className='container'>
          <section className='auth-content' style={{ margin: '20px 0px 80px 0px' }}>
            {!formError ? (
              // eslint-disable-next-line react/jsx-no-useless-fragment
              <>
                {!successPopup
                  ? (
                    <form onSubmit={onSubmit} className='rfp-form'>
                      <div className='mb-3 mt-3 w-100 text-start'>{formData?.header_text !== undefined && formData.header_text !== null && parse(formData.header_text)}</div>
                      <InputField
                        label='Company Name'
                        name='company_name'
                        type='text'
                        required
                        onChange={(e: React.ChangeEvent<HTMLInputElement>): void => { handleChange(e); }}
                      />
                      <InputField
                        label='Contact Name'
                        name='contact_name'
                        type='text'
                        required
                        onChange={(e: React.ChangeEvent<HTMLInputElement>): void => { handleChange(e); }}
                      />
                      <InputField
                        label='Phone'
                        name='phone'
                        type='text'
                        required
                        onChange={(e: React.ChangeEvent<HTMLInputElement>): void => { handleChange(e); }}
                      />
                      <InputField
                        label='Email Address'
                        name='email'
                        type='text'
                        // eslint-disable-next-line react/jsx-boolean-value
                        required={true}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>): void => { handleChange(e); }}
                      />
                      <p className='rfp-styled-p'>Total Bid Price</p>
                      <InputField
                        name='total_amount'
                        type='number'
                        className={classes.nolabelcurrencyfields}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>): void => { handleChange(e); }}
                        required
                        startAdornment={<StartDollerSign />}
                      />
                      {formData?.questions?.map((item) => (item.field_type === 'textfield' ? (
                        <>
                          <p className='rfp-styled-p'>
                            {item.label}
                          </p>
                          <InputField
                            name={String(item.id)}
                            type='text'
                            required
                            className={classes.nolabelfields}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>): void => { handleChange(e); }}
                          />
                        </>
                      ) : item.field_type === 'currency' ? (
                        <>
                          <p className='rfp-styled-p'>
                            {item.label}
                          </p>
                          <InputField
                            name={String(item.id)}
                            type='number'
                            className={classes.nolabelcurrencyfields}
                            onChange={(e): void => { handleChange(e); }}
                            // value={fieldsData.total_amount}
                            startAdornment={<StartDollerSign />}
                          />
                        </>
                      ) : item.field_type === 'textarea' ? (
                        <>
                          <p className='rfp-styled-p'>
                            {item.label}
                          </p>
                          <InputField
                            name={String(item.id)}
                            type='text'
                            rows={item.rows ?? 4}
                            multiline
                            className={classes.nolabelfields}
                            required
                            onChange={(e: React.ChangeEvent<HTMLInputElement>): void => { handleChange(e); }}
                          />
                        </>
                      )
                        : item.field_type === 'select' ? (
                          <>
                            <p className='rfp-styled-p'>
                              {item.label}
                            </p>
                            <SelectInput
                            // value={fieldsData[item.id]}
                              name={String(item.id)}
                              label=''
                              className={`w-100 ${classes.sss} ${classes.nolabelfields}`}
                              onChange={(e: SelectChangeEvent): void => { handleChange(e); }}
                              options={item.options ?? []}
                              defaultValue='true'
                              showPleaseSelect={false}
                            />
                          </>
                        )
                          : item.field_type === 'checkbox' ? (
                            <p className='rfp-styled-p mb-2'>
                              <Checkbox
                                name={String(item.id)}
                                style={{ padding: '0' }}
                                color='primary'
                                onChange={(e): void => {
                                  handleChange(e);
                                }}
                              />
                              <span style={{ color: 'rgba(0, 0, 0, 0.87)', marginLeft: '9px' }}>{item.label}</span>
                            </p>
                          )
                            : item.field_type === 'day' ? (
                              <>
                                <p className='rfp-styled-p'>
                                  {item.label}
                                </p>
                                <InputField
                                  name={String(item.id)}
                                  type='date'
                                  required
                                  className={classes.nolabelfields}
                                  onChange={(e: React.ChangeEvent<HTMLInputElement>): void => { handleChange(e); }}
                                />
                              </>
                            )
                              : item.field_type === 'signature' ? (
                                <>
                                  <p className='rfp-styled-p'>
                                    {item.label}
                                  </p>
                                  <div className='refreshSign'>
                                    <div
                                      aria-hidden='true'
                                      onClick={(): void => {
                                        if (item.id !== undefined) {
                                          signPad[item.id]?.clear();
                                          setFieldsData({ ...fieldsData, [item.id]: '' });
                                        }
                                      }}
                                    >
                                      <RefreshIcon />
                                    </div>
                                    <div
                                      aria-hidden='true'
                                      onClick={(): void => {
                                        enqueueSnackbar('Signature is added');
                                        if (item.id !== undefined) {
                                          setFieldsData({
                                            ...fieldsData,
                                            [item.id]: {
                                              name: `sign${item.id}`,
                                              file: signPad[item.id]?.getTrimmedCanvas().toDataURL('image/png'),
                                            },
                                          });
                                        }
                                      }}
                                      className='SaveDivBtn'
                                    >
                                      Save
                                    </div>
                                  </div>
                                  <SignatureCanvas
                                  // penColor='black'
                                    canvasProps={{
                                      width: 370,
                                      height: 120,
                                      className: 'sigCanvas',
                                    }}
                                    ref={(ref): void => {
                                      if (item.id !== undefined && ref !== null) {
                                        signPad[item.id] = ref;
                                      }
                                    }}
                                  />
                                </>
                              )
                                : item.field_type === 'file' ? (
                                  <div className='mb-2 w-100'>
                                    <p className='rfp-styled-p'>
                                      {item.label}
                                    </p>
                                    <div
                                      style={{
                                        border: '1px solid #E4E4E4',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        paddingLeft: '20px',
                                        marginTop: '10px',
                                        borderRadius: '8px',
                                        height: '60px',
                                        width: '100%',
                                      }}
                                    >
                                      <input
                                        name={String(item.id)}
                                        type='file'
                                        // eslint-disable-next-line no-void
                                        onChange={(e): void => { void fileHandler(e); }}
                                        required
                                      />
                                    </div>
                                  </div>
                                )
                                  : item.field_type === 'survey' ? (
                                    <p className='rfp-styled-p mb-2'>
                                      {item.label}
                                      <Table aria-label='simple table' className='survey-top'>
                                        <TableHead>
                                          <TableRow style={{ lineHeight: '10px' }}>
                                            <TableCell
                                              align='left'
                                              style={{ width: '35%' }}
                                            >
                                              <span style={{ fontSize: '14px' }} />
                                            </TableCell>
                                            {item.answer?.map((val) => (
                                              <TableCell align='center'>
                                                <span style={{ fontSize: '14px' }}>
                                                  {val.label}
                                                </span>
                                              </TableCell>
                                            ))}
                                          </TableRow>
                                        </TableHead>
                                        <TableBody>
                                          {item.question?.map((val) => (
                                            <TableRow style={{ lineHeight: '10px' }}>
                                              <TableCell align='left'>
                                                <span>{val.label}</span>
                                              </TableCell>
                                              {item.answer?.map((ans) => (
                                                <TableCell align='center'>
                                                  <input
                                                    type='radio'
                                                    name={val.label}
                                                    value={ans.label}
                                                    required
                                                    onChange={(e): void => {
                                                      item.response[e.target.name] = e.target.value;
                                                      item.id !== undefined && setFieldsData({ ...fieldsData, [item.id]: { answer: item.answer, question: item.question, response: item.response } });
                                                    }}
                                                  />
                                                </TableCell>
                                              ))}
                                            </TableRow>
                                          ))}
                                        </TableBody>
                                      </Table>
                                    </p>
                                  )

                                    : null))}
                      <div className='mb-3 mt-3 w-100 text-start'>{formData?.footer_text !== undefined && formData.footer_text !== null && parse(formData.footer_text)}</div>
                      <div className='mt-3'>
                        <Button className='mt-3 text-transform-none' style={{ color: 'white' }} variant='contained' type='submit'> Submit </Button>
                      </div>
                    </form>
                  )
                  : (
                    <div className='rfpsuccess-div'>
                      <div style={{ margin: '30px 0px' }}><TickIcon /></div>
                      <p>Thank you!</p>
                      <h6>Your submission has been received!</h6>
                    </div>
                  )}
              </>
            )
              : (
                <div className='formError-div'>
                  <div>
                    <h6>Invalid Form Link</h6>
                  </div>
                </div>
              )}
          </section>
        </div>
      </main>
    </div>
  );
}
