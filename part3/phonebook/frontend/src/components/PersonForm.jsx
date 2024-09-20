const PersonForm = ({
  name,
  number,
  onChangeName,
  onChangeNumber,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit}>
      <div>
        name:&nbsp;
        <input name="phone-name" value={name} onChange={onChangeName} />
      </div>
      <div>
        number:&nbsp;
        <input name="phone-number" value={number} onChange={onChangeNumber} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

export default PersonForm;
