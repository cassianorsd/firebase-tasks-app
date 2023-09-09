import { render, screen } from '@testing-library/react'
import { describe, expect}  from 'vitest'
import { AuthContextProvider } from '../../../contexts/Auth/provider'
import { BrowserRouter } from 'react-router-dom'
import { Home } from '..'

function renderInAppContext(children: React.ReactNode) {
  return render(
    <AuthContextProvider>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </AuthContextProvider>
  )
}


describe('HomePage',()=>{
  it('renders', async () => {
    renderInAppContext(<Home/>)
    expect(await screen.findByText('Simplifique sua colaboração')).toBeVisible()
  })
})


