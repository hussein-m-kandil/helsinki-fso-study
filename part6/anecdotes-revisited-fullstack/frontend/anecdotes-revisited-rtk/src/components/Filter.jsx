import { useDispatch } from 'react-redux';
import { filter } from '../slices/filterSlice';

const Filter = () => {
  const dispatch = useDispatch();

  const handleFilter = ({ target: filterInput }) => {
    dispatch(filter(filterInput.value));
  };

  return (
    <div style={{ marginBlock: '1rem' }}>
      <h2 style={{ margin: 0, fontSize: 'large' }} id="anecdotes-filter-label">
        <label style={{ verticalAlign: 'middle' }} htmlFor="filter-input">
          Filter
        </label>
        <input
          id="filter-input"
          autoComplete="on"
          onChange={handleFilter}
          style={{ margin: '0 0.5rem' }}
        />
      </h2>
    </div>
  );
};

export default Filter;
