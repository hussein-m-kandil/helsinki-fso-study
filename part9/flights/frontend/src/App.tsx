import { useEffect, useState } from 'react';
import { isDiaryEntryArray } from './utils';
import { DiaryEntry } from './types';
import diaryService from './services/diaryService';
import NewDiaryForm from './components/NewDiaryForm';

const App = () => {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);

  useEffect(() => {
    diaryService.getAll().then((data) => {
      if (isDiaryEntryArray(data)) setDiaries(data);
    });
  }, []);

  return (
    <>
      <h1>Flights</h1>
      <NewDiaryForm
        onSuccess={(newDiaryEntry) => setDiaries([...diaries, newDiaryEntry])}
      />
      <h2 id='diary-entries-label'>Diary Entries</h2>
      <ul aria-labelledby='diary-entries-label'>
        {diaries.map((d) => (
          <li key={d.id}>
            <h3>{d.date}</h3>
            <p>visibility: {d.visibility}</p>
            <p>weather: {d.weather}</p>
            <p>comment: {d.comment || '...'}</p>
          </li>
        ))}
      </ul>
    </>
  );
};

export default App;
