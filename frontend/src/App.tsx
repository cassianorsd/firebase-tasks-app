import { BrowserRouter } from 'react-router-dom'
import { globalStyles } from './styles/global'
import { Router } from './Router'
import { AuthContextProvider } from './contexts/Auth/provider'

function App() {
  globalStyles()
  return (
    <>
      <AuthContextProvider>
        <BrowserRouter>
          <Router/>
        </BrowserRouter>
      </AuthContextProvider>
    </>
  )
}

export default App
