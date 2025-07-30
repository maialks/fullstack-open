type RadioProps<T extends string> = {
  name: string;
  items: Readonly<T>[];
  value: string | null;
  onChange: (value: T) => void;
};

function RadioGroup<T extends string>({
  name,
  items,
  value,
  onChange,
}: RadioProps<T>) {
  return (
    <>
      <p style={{ marginTop: 5, marginBottom: 0 }}>
        {name.charAt(0).toUpperCase() + name.slice(1)}
      </p>
      <div style={{ display: 'flex', gap: 5, marginBottom: 10 }}>
        {items.map((item: T) => (
          <div key={item}>
            <input
              type='radio'
              name={name}
              value={item}
              id={item + name}
              checked={value === item}
              onChange={
                (e: React.ChangeEvent<HTMLInputElement>) =>
                  onChange(e.target.value as T) // onchange vai ser somente o setValue do state
              }
            />
            <label htmlFor={item + name}>
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </label>
          </div>
        ))}
      </div>
    </>
  );
}

export default RadioGroup;
