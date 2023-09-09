import { act, render, screen } from '@testing-library/react'
import { describe, expect, vi}  from 'vitest'
import { AuthContextProvider } from '../../../contexts/Auth/provider'
import { BrowserRouter } from 'react-router-dom'
import { AuthContextType } from '../../../contexts/Auth/context'
import userEvent from '@testing-library/user-event'
import * as useAuthHookFile from '../../../hooks/useAuth'
import { BoardPage } from '..'
import '../../../lib/dayjs'




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

const collectionMock = {
  docs: [
    {
      id: '1',
      data: () => ({
        createdAt: {
          seconds: 1693761927
        },
        title: 'desenvolver frontend',
        description: 'desenvolver-frontend',
        locked: false,
        user: {
          uid: '1',
          name: 'John Doe',
          avatarUrl: '',
        }
      })
    }
  ]
}


vi.mock('react-firebase-hooks/firestore', () => {
  const original = vi.importActual('react-firebase-hooks/firestore')
  return {
    ...original,
    useCollection: () => [collectionMock, false, undefined],
  }
})

describe('BoardPage',()=>{

  beforeEach(()=>{
    useAuthSpy.mockReturnValue({
      user: {
        displayName: 'John Doe',
      },
      signIn: signInMock,
      isAuthenticating: false,
      signOut: signOutMock, 
    } as unknown as AuthContextType)
  })

  it('renders', async () => {
    renderInAppContext(<BoardPage/>)
    expect(await screen.findByText('Quadro de Atividades')).toBeVisible()
  })

  it('allows user to open new task form',async () => {
    renderInAppContext(<BoardPage/>)

    const btn = await screen.getByTestId('add-new-task-button')
    expect(btn).toBeVisible()

    await act(async () => {
      await userEvent.click(btn)
    })

    expect(await screen.getByTestId('new-task-form')).toBeVisible()
  })

  it('allow user to search tasks', async () => {
    renderInAppContext(<BoardPage/>)

    const searchInput = await screen.getByTestId('search-input')
    expect(searchInput).toBeVisible()

    await act(async () => {
      await userEvent.type(searchInput, 'frontend')
    })

    expect(searchInput).toHaveValue('frontend')

    expect(await screen.findByText('desenvolver-frontend')).toBeVisible()
  })

})


