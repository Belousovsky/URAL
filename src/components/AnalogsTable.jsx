import { useSelector, useDispatch } from 'react-redux'
import { backToManufacturers } from '../store/partsSlice'

export default function AnalogsTable() {
  const dispatch = useDispatch()
  const { items, selectedBrand, article } = useSelector((state) => state.parts)

  if (items.length === 0) return null

  return (
    <div className="card shadow-sm p-3 mb-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">
          Предложения и аналоги: <strong>{selectedBrand}</strong> ({article})
        </h5>
        <button
          type="button"
          className="btn btn-outline-secondary btn-sm"
          onClick={() => dispatch(backToManufacturers())}
        >
          ← Назад к брендам
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th>Название / Производитель</th>
              <th>Артикул</th>
              <th>Тип</th>
              <th>Склад</th>
              <th className="text-end">Остаток на складе</th>
              <th className="text-end">Стоимость (цена)</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>
                  <strong>{item.name}</strong>
                  <div className="text-muted small">{item.brand}</div>
                </td>
                <td>
                  <code>{item.number}</code>
                </td>
                <td>
                  {item.isAnalogue ? (
                    <span className="badge bg-info text-dark">Аналог</span>
                  ) : (
                    <span className="badge bg-primary">Искомый</span>
                  )}
                </td>
                <td>{item.warehouse}</td>
                <td className="text-end">
                  {item.stock > 0 ? (
                    <span className="badge bg-success">{item.stock} шт.</span>
                  ) : (
                    <span className="text-muted">0 шт.</span>
                  )}
                </td>
                <td className="text-end">
                  {item.price !== null ? (
                    <strong>{item.price.toLocaleString('ru-RU')} ₽</strong>
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
