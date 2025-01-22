export default function Card({title, subtitle, label, setValue, value = 0, children={} }) {
  return (
    <div style={{boxShadow: "rgb(0 0 0 / 40%) 0px 1rem 2rem"}} className="card mt-4 mb-4">
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
            value={value}
          />
        </div>
        {children}
      </div>
    </div>
  );
}
