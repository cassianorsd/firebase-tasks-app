import { act, render, screen } from '@testing-library/react'
import { describe, expect, vi}  from 'vitest'
import { AuthContextProvider } from '../../../contexts/Auth/provider'
import { BrowserRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import { NewTaskForm } from '..'
import '../../../lib/dayjs'
import * as useAuthHookFile from '../../../hooks/useAuth'
import { AuthContextType } from '../../../contexts/Auth/context'

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

// connectAuthEmulator(auth, 'http://127.0.0.1:9099');
// addDocFile.connectFirestoreEmulator(firestore, 'localhost', 8080);

const addDocMock = vi.fn()

vi.mock("firebase/firestore", async () => {
  const actual = await vi.importActual("firebase/firestore") as object
  return {
    __esModule: true,
    ...actual,
    addDoc: () => () => addDocMock,
  }
})

const onCloseMock = vi.fn()

describe('NewTaskForm',()=>{

  beforeEach(()=>{
    useAuthSpy.mockReturnValue({
      user: undefined,
      isAuthenticating: false,
    } as unknown as AuthContextType)    
  })

  it('renders', async () => {
    renderInAppContext(<NewTaskForm show={true} onClose={onCloseMock}/>)
    expect(await screen.getByTestId('new-task-form')).toBeVisible()
  })


  it('doesnt allow user to submit form without title', async () => {
    renderInAppContext(<NewTaskForm show={true} onClose={onCloseMock}/>)
    const submitBtn = await screen.getByTestId('submit-button')
    expect(submitBtn).toBeVisible()
    await act(async () => {
      await userEvent.click(submitBtn)
    })
    expect(await screen.getByTestId('title-input-error')).toBeVisible()
  })

  it('doesnt allow user to submit without being logged in', async () => {
    renderInAppContext(<NewTaskForm show={true} onClose={onCloseMock}/>)
    const submitBtn = await screen.getByTestId('submit-button')
    expect(submitBtn).toBeVisible()
    await act(async () => {
      await userEvent.type(await screen.getByTestId('title-input'), 'desenvolver frontend')
      await userEvent.click(submitBtn)
    })
    expect(await screen.getByText('Você precisa estar logado para adicionar uma tarefa')).toBeVisible()
  })

  it('allows logged user to submit form', async () => {
    useAuthSpy.mockReturnValue({
      user: {
        displayName: 'John Doe',
        uid: '1',
        photoURL: 'url',
      },
      isAuthenticating: false,
    } as unknown as AuthContextType)

    renderInAppContext(<NewTaskForm show={true} onClose={onCloseMock}/>)
    const submitBtn = await screen.getByTestId('submit-button')
    expect(submitBtn).toBeVisible()
    await act(async () => {
      await userEvent.type(await screen.getByTestId('title-input'), 'desenvolver frontend')
      await userEvent.click(submitBtn)
    })
    expect(onCloseMock).toHaveBeenCalledTimes(1)
  })


})


