export default function Card({title, subtitle, label, setValue, value = 0, children={} }) {
  return (
<>
        <h5 className="card-title">
          {title}
        </h5>
        <br />
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
            value={value}
          />
        </div>
        {children}
</>
  );
}
