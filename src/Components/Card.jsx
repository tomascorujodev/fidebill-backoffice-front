export default function Card({title, subtitle, label, setValue, children={} }) {
  return (
    <div className="card mt-4">
      <div className="card-body">
        <h5 className="card-title">
          {title}
        </h5>
        <p className="card-text">{subtitle}</p>

        <div className="mb-3">
          <label htmlFor="cardinput" className="form-label">
            {label}
          </label>
          <input
            type="number"
            className="form-control"
            id="cardinput"
            onChange={e => setValue(e.target.value)}
          />
        </div>
        {children}
      </div>
    </div>
  );
}
