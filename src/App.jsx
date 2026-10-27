import { useSelector } from 'react-redux'
import Header from './components/Header'
import SearchBar from './components/SearchBar'
import ManufacturerList from './components/ManufacturerList'
import AnalogsTable from './components/AnalogsTable'
import Loader from './components/Loader'
import ErrorMessage from './components/ErrorMessage'

export default function App() {
  const { loading, error, selectedBrand } = useSelector((state) => state.parts)

  return (
    <div className="pb-5">
      <Header />
      <div className="container">
        <SearchBar />

        <ErrorMessage message={error} />

        {loading && <Loader />}

        {!loading && !selectedBrand && <ManufacturerList />}

        {!loading && selectedBrand && <AnalogsTable />}
      </div>
    </div>
  )
}
