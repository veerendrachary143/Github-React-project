import { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { fetchRepositoriesRequested } from './features/repositories/repositorySlice'
import RepositoryListPage from './pages/RepositoryListPage'

function App() {
  const dispatch = useDispatch()
  const didRequestInitialRepositories = useRef(false)

  useEffect(() => {
    if (didRequestInitialRepositories.current) return
    didRequestInitialRepositories.current = true
    dispatch(fetchRepositoriesRequested({ reset: true }))
  }, [dispatch])

  return <RepositoryListPage />
}

export default App
