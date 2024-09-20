const Filter = ({ filterValue, onFilter }) => {
  return (
    <div>
      filter shown with&nbsp;
      <input name="phone-search" value={filterValue} onChange={onFilter} />
    </div>
  );
};

export default Filter;
