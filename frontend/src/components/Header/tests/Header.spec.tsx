import { act, render, screen } from '@testing-library/react'
import { describe, expect, vi}  from 'vitest'
import { AuthContextProvider } from '../../../contexts/Auth/provider'
import { BrowserRouter } from 'react-router-dom'
import { Header } from '..'
import { AuthContextType } from '../../../contexts/Auth/context'
import userEvent from '@testing-library/user-event'
import * as useAuthHookFile from '../../../hooks/useAuth'




function renderInAppContext(children: React.ReactNode) {
  return render(
    <AuthContextProvider>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </AuthContextProvider>
  )
}

const useAuthSpy = vi.spyOn(useAuthHookFile,"useAuth")
const signInMock = vi.fn()
const signOutMock = vi.fn()


const mockNavigate = vi.fn()


vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom") as object
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})



describe('Header',()=>{

  beforeEach(()=>{
    useAuthSpy.mockReturnValue({
      user: null,
      signIn: signInMock,
      isAuthenticating: false,
      signOut: signOutMock, 
    })
  })

  it('renders', async () => {
    renderInAppContext(<Header/>)
    expect(await screen.findByText('fireTask')).toBeVisible()
  })

  it('should be able to click on the sign in button', async () => {
    renderInAppContext(<Header/>)
    const btn = await screen.findByText('Entrar')
    expect(btn).toBeVisible()

    await act(async () => {
      await userEvent.click(btn)
    })

    expect(signInMock).toHaveBeenCalled()
  })

  it('shows the user name when authenticated', async () => {
    useAuthSpy.mockReturnValue({
      user: {
        displayName: 'John Doe'
      },
      signOut: signOutMock,
    } as unknown as AuthContextType)

    renderInAppContext(<Header/>)
    expect(await screen.findByText('John Doe')).toBeVisible()
  })

  it('should be able to logout', async () => {
    useAuthSpy.mockReturnValue({
      user: {
        displayName: 'John Doe'
      },
      signOut: signOutMock,
    } as unknown as AuthContextType)

    renderInAppContext(<Header/>)
    const btn = await screen.findByText('Sair')
    expect(btn).toBeVisible()

    await act(async () => {
      await userEvent.click(btn)
    })

    expect(signOutMock).toHaveBeenCalled()
  })

  it('should allow user to navigate to the board page', async () => {
    useAuthSpy.mockReturnValue({
      user: {
        displayName: 'John Doe'
      },
      signOut: signOutMock,
    } as unknown as AuthContextType)

    renderInAppContext(<Header/>)
    const link = await screen.findByText('Board')
    expect(link).toBeVisible()
  })

  it('should allow user to navigate to the home page', async () => {
    renderInAppContext(<Header/>)
    const link = await screen.findByText('fireTask')
    expect(link).toBeVisible()
  })

})


