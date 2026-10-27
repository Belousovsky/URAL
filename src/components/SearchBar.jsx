import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { searchManufacturers, reset } from '../store/partsSlice'

const EXAMPLES = ['0189', '7160500039S', '01089']

export default function SearchBar() {
  const dispatch = useDispatch()
  const { article, loading } = useSelector((state) => state.parts)

  const [prevArticle, setPrevArticle] = useState(article)
  const [value, setValue] = useState(article || '')

  if (article !== prevArticle) {
    setPrevArticle(article)
    setValue(article || '')
  }

  const handleSearch = (target) => {
    const query = (target ?? value).trim()
    if (!query) return
    setValue(query)
    dispatch(searchManufacturers(query))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    handleSearch()
  }

  const handleReset = () => {
    setValue('')
    dispatch(reset())
  }

  return (
    <div className="card shadow-sm p-3 mb-4">
      <form onSubmit={handleSubmit} className="d-flex gap-2">
        <input
          type="text"
          className="form-control"
          placeholder="Введите артикул запчасти (например: 0189)"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={loading}
        />
        {value && (
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={handleReset}
            disabled={loading}
          >
            Очистить
          </button>
        )}
        <button
          type="submit"
          className="btn btn-primary text-nowrap"
          disabled={loading || !value.trim()}
        >
          {loading ? 'Поиск...' : 'Найти'}
        </button>
      </form>

      <div className="d-flex align-items-center gap-2 mt-2">
        <small className="text-muted">Примеры:</small>
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            type="button"
            className="btn btn-light btn-sm border py-0 px-2"
            disabled={loading}
            onClick={() => handleSearch(ex)}
          >
            {ex}
          </button>
        ))}
      </div>
    </div>
  )
}
