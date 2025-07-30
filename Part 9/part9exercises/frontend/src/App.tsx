import { useEffect, useState } from 'react';
import diaryService from './services/diaryService';
import type { NonSensitiveDiaryEntry, Visibility, Weather } from './types';
import { VISIBILITY_VALUES, WEATHER_VALUES } from './types';
import Notification from './components/Notification';
import { useNotification } from './hooks/useNotification';
import axios from 'axios';
import RadioGroup from './components/RadioGroup';

function useField<T = string>(
  type: HTMLInputElement['type'] = 'text',
  initialValue: T | string = ''
) {
  const [value, setValue] = useState(initialValue);
  const clear = () => setValue(initialValue);
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value as unknown as T;
    setValue(inputValue);
  };

  return {
    clear,
    inputProps: {
      type,
      value,
      onChange,
    },
  };
}

function App() {
  const [entries, setEntries] = useState<NonSensitiveDiaryEntry[]>([]);
  useEffect(() => {
    async function fetchItems(): Promise<void> {
      const response = await diaryService.getNonSensitiveEntries();
      setEntries(response);
    }
    fetchItems();
  }, []);

  const [weather, setWeather] = useState<null | Weather>(null);
  const [visibility, setVisibility] = useState<null | Visibility>(null);
  const comment = useField();
  const date = useField('date');

  const { showNotification } = useNotification();

  if (!entries.length) return <div>Loading...</div>;

  function clearInputs(): void {
    comment.clear();
    date.clear();
    setVisibility(null);
    setWeather(null);
  }

  async function onSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    try {
      const entry = await diaryService.createEntry({
        visibility: visibility as Visibility,
        comment: comment.inputProps.value,
        date: date.inputProps.value,
        weather: weather as Weather,
      });
      const { comment: _deletedComment, ...nonSensitiveDataEntry } = entry;
      setEntries(entries.concat(nonSensitiveDataEntry));
      clearInputs();
    } catch (err: unknown) {
      if (axios.isAxiosError(err))
        showNotification(err.response?.data.slice(28), 5000);
      else
        showNotification(
          'Unknown error while creating entry, check console for more'
        );
    }
  }

  return (
    <div style={{ marginLeft: 15 }}>
      <Notification />
      <h1>Flight Diaries</h1>
      <ul>
        {entries.map((e) => (
          <li key={e.id}>
            {e.date} - {e.weather} <br /> Visibility: {e.visibility}
          </li>
        ))}
      </ul>
      <h2>Add New</h2>
      <form
        onSubmit={onSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: 5 }}
      >
        <label htmlFor='commentInput'>Comment</label>
        <input {...comment.inputProps} id='commentInput' />
        <label htmlFor='dateInput'>Date</label>
        <input {...date.inputProps} id='dateInput' />
        <RadioGroup<Weather>
          name='weather'
          items={[...WEATHER_VALUES]}
          value={weather}
          onChange={setWeather}
        />
        <RadioGroup<Visibility>
          name='visibility'
          items={[...VISIBILITY_VALUES]}
          value={visibility}
          onChange={setVisibility}
        />
        <button type='submit'>Save</button>
      </form>
    </div>
  );
}

export default App;
