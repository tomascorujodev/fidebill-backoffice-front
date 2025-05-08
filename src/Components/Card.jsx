export default function Card({ title, subtitle, label, setValue, value = 0, reintegroOpciones = null, setPorcentajeReintegro = null, children = {} }) {
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
        <div className="d-flex align-items-center gap-2">
          <input
            type="number"
            className="form-control w-50"
            id="cardinput"
            onChange={e => setValue(e.target.value)}
            value={value}
          />
          {
            reintegroOpciones && setPorcentajeReintegro &&
            <select style={{ width: "90px" }} className="form-select" onChange={(e) => setPorcentajeReintegro(e.target.value)}>
              {
                reintegroOpciones.map((opcion) => (
                  <option key={opcion}>{opcion}%</option>
                ))
              }
            </select>
          }
        </div>
      </div>
      {children}
    </>
  );
}
