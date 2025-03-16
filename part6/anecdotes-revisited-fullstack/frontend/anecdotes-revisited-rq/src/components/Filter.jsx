const Filter = ({ value, onChange }) => {
  return (
    <div style={{ marginBlock: '1rem' }}>
      <h2 style={{ margin: 0, fontSize: 'large' }} id="anecdotes-filter-label">
        <label style={{ verticalAlign: 'middle' }} htmlFor="filter-input">
          Filter
        </label>
        <input
          value={value}
          id="filter-input"
          autoComplete="on"
          onChange={onChange}
          style={{ margin: '0 0.5rem' }}
        />
      </h2>
    </div>
  );
};

export default Filter;
