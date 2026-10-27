export default function Loader({ text = 'Загрузка данных...' }) {
  return (
    <div className="text-center my-4 py-3">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Загрузка...</span>
      </div>
      <div className="mt-2 text-muted">{text}</div>
    </div>
  )
}
