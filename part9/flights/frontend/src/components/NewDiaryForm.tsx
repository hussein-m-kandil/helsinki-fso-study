import React, { useRef, useState } from 'react';
import { DiaryEntry, Visibility, Weather } from '../types';
import { isAxiosError } from 'axios';
import diaryService from '../services/diaryService';

const RadioBtnsFromEnum = (props: {
  enumObj: object;
  name: string;
  defaultValue: string;
  onChange: (enumStrKey: string) => void;
}) => {
  const { enumObj, name, defaultValue, onChange } = props;
  return (
    <p>
      {name}:{' '}
      {Object.entries(enumObj).map(([k, v]) => (
        <label key={v}>
          <input
            type='radio'
            value={v}
            name={name}
            checked={v === defaultValue}
            onChange={() => onChange(String(k))}
          />
          {v}
        </label>
      ))}
    </p>
  );
};

const NewDiaryForm = ({
  onSuccess,
}: {
  onSuccess: (de: DiaryEntry) => void;
}) => {
  const [visibility, setVisibility] = useState<Visibility>(Visibility.Ok);
  const [weather, setWeather] = useState<Weather>(Weather.Sunny);
  const [comment, setComment] = useState('');
  const [date, setDate] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const formErrorTimeoutRef = useRef(0);

  const resetFormError = () => {
    window.clearTimeout(formErrorTimeoutRef.current);
    setErrorMessage('');
  };

  const createDiary: React.FormEventHandler = (e) => {
    e.preventDefault();
    resetFormError();
    const form = e.target as typeof e.target & { submitter: HTMLButtonElement };
    form.submitter.disabled = true;
    diaryService
      .addOne({ date, visibility, weather, comment })
      .then((newDiaryEntry) => {
        onSuccess(newDiaryEntry);
        setVisibility(Visibility.Ok);
        setWeather(Weather.Sunny);
        setComment('');
        setDate('');
      })
      .catch((error) => {
        console.log(error instanceof Error ? error.toString() : error);
        if (isAxiosError(error) && error.response?.data) {
          setErrorMessage(error.response.data);
        } else {
          setErrorMessage('Something went wrong! Try again later.');
        }
      })
      .finally(() => {
        form.submitter.disabled = false;
        formErrorTimeoutRef.current = window.setTimeout(
          () => setErrorMessage(''),
          5000
        );
      });
  };

  return (
    <>
      <h2 id='new-diary-entry-form-label'>Add New Diary Entries</h2>
      <p className='error'>{errorMessage}</p>
      <form aria-labelledby='new-diary-entry-form-label' onSubmit={createDiary}>
        <p>
          <label>
            date:{' '}
            <input
              required
              type='date'
              name='date'
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </label>
        </p>
        <RadioBtnsFromEnum
          enumObj={Visibility}
          name='visibility'
          defaultValue={visibility}
          onChange={(enumStrKey) => {
            const key = enumStrKey as keyof typeof Visibility;
            setVisibility(Visibility[key]);
          }}
        />
        <RadioBtnsFromEnum
          enumObj={Weather}
          name='weather'
          defaultValue={weather}
          onChange={(enumStrKey) => {
            const key = enumStrKey as keyof typeof Weather;
            setWeather(Weather[key]);
          }}
        />
        <p>
          <label>
            comment:{' '}
            <input
              type='text'
              name='comment'
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </label>
        </p>
        <button type='submit' name='submitter'>
          add
        </button>
      </form>
    </>
  );
};

export default NewDiaryForm;
