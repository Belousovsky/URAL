import { useSelector, useDispatch } from 'react-redux'
import { fetchOffers } from '../store/partsSlice'

export default function ManufacturerList() {
  const dispatch = useDispatch()
  const { manufacturers, article, loading } = useSelector((state) => state.parts)

  if (manufacturers.length === 0) return null

  const handleSelect = (brand) => {
    dispatch(fetchOffers({ number: article, brand }))
  }

  return (
    <div className="card shadow-sm p-3 mb-4">
      <h5 className="mb-3">
        Производители для артикула <strong>{article}</strong>:
      </h5>
      <p className="text-muted small">
        Выберите производителя для получения аналогов и предложений:
      </p>

      <div className="d-flex flex-wrap gap-2">
        {manufacturers.map((brand) => (
          <button
            key={brand}
            type="button"
            className="btn btn-outline-primary"
            disabled={loading}
            onClick={() => handleSelect(brand)}
          >
            {brand}
          </button>
        ))}
      </div>
    </div>
  )
}
