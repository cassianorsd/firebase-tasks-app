import { act, render, screen } from '@testing-library/react'
import { describe, expect, vi}  from 'vitest'
import { AuthContextProvider } from '../../../contexts/Auth/provider'
import { BrowserRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import '../../../lib/dayjs'
import * as useAuthHookFile from '../../../hooks/useAuth'
import { AuthContextType } from '../../../contexts/Auth/context'
import { EditTaskForm } from '..'
import { Task } from '../../../shared/interfaces/task'

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

vi.mock("firebase/firestore", async () => {
  const actual = await vi.importActual("firebase/firestore") as object
  return {
    ...actual,
    doc: vi.fn()
  }
})

const updateDocMock = vi.fn()

vi.mock("firebase/firestore", async () => {
  const actual = await vi.importActual("firebase/firestore") as object
  return {
    __esModule: true,
    ...actual,
    updateDoc: () => () => updateDocMock,
  }
})

const onCloseMock = vi.fn()

const task: Task = {
  id: '1',
  title: 'desenvolver frontend',
  description: 'desenvolver frontend',
  createdAt: new Date(),
  locked: false,
  status: 'PENDING',
  squad: '',
  user: {
    avatarUrl: 'url',
    name: 'John Doe',
    uid: '1',
  }
}

describe('EditTaskForm',()=>{

  beforeEach(()=>{
    useAuthSpy.mockReturnValue({
      user: undefined,
      isAuthenticating: false,
    } as unknown as AuthContextType)    
  })

  it('renders', async () => {
    renderInAppContext(<EditTaskForm show={true} onClose={onCloseMock} task={task} />)
    expect(await screen.getByTestId('task-form')).toBeVisible()
  })


  it('doesnt allow user to submit without being logged in', async () => {
    renderInAppContext(<EditTaskForm show={true} onClose={onCloseMock} task={task}/>)
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
        photoURL: '',
      },
      isAuthenticating: false,
    } as unknown as AuthContextType)

    renderInAppContext(<EditTaskForm show={true} onClose={onCloseMock} task={task}/>)
    const submitBtn = await screen.getByTestId('submit-button')
    expect(submitBtn).toBeVisible()
    await act(async () => {
      await userEvent.type(await screen.getByTestId('title-input'), 'desenvolver frontend')
      await userEvent.click(submitBtn)
    })

    expect(onCloseMock).toHaveBeenCalledTimes(1)
    
  })

  it('doesnt allow user to edit locked task from another user', async () => {
    useAuthSpy.mockReturnValue({
      user: {
        displayName: 'John Doe',
        uid: '2',
        photoURL: '',
      },
      isAuthenticating: false,
    } as unknown as AuthContextType)

    renderInAppContext(<EditTaskForm show={true} onClose={onCloseMock} task={{
      ...task,
      locked: true,
    }}/>)
    const submitBtn = await screen.getByTestId('submit-button')
    expect(submitBtn).toBeVisible()
    await act(async () => {
      await userEvent.type(await screen.getByTestId('title-input'), 'desenvolver frontend')
      await userEvent.click(submitBtn)
    })

    expect(await screen.getByText('Você não tem permissão para editar esta tarefa')).toBeVisible()

  })

  it('doe allow user to edit task from another user', async () => {
    useAuthSpy.mockReturnValue({
      user: {
        displayName: 'John Doe',
        uid: '2',
        photoURL: '',
      },
      isAuthenticating: false,
    } as unknown as AuthContextType)

    renderInAppContext(<EditTaskForm show={true} onClose={onCloseMock} task={{
      ...task,
      locked: false,
    }}/>)
    const submitBtn = await screen.getByTestId('submit-button')
    expect(submitBtn).toBeVisible()
    await act(async () => {
      await userEvent.type(await screen.getByTestId('title-input'), 'desenvolver frontend')
      await userEvent.click(submitBtn)
    })

    expect(onCloseMock).toHaveBeenCalledTimes(1)

  })

  it('doesnt allow user to delete locked task from another user', async () => {
    useAuthSpy.mockReturnValue({
      user: {
        displayName: 'John Doe',
        uid: '2',
        photoURL: '',
      },
      isAuthenticating: false,
    } as unknown as AuthContextType)

    renderInAppContext(<EditTaskForm show={true} onClose={onCloseMock} task={{
      ...task,
      locked: true,
    }}/>)
    const deleteBtn = await screen.getByTestId('delete-button')
    expect(deleteBtn).toBeVisible()
    await act(async () => {
      await userEvent.click(deleteBtn)
    })

    expect(await screen.getByText('Você não tem permissão para deletar esta tarefa')).toBeVisible()

  })

  it('does allow user to delete task from another user', async () => {
    useAuthSpy.mockReturnValue({
      user: {
        displayName: 'John Doe',
        uid: '2',
        photoURL: '',
      },
      isAuthenticating: false,
    } as unknown as AuthContextType)

    renderInAppContext(<EditTaskForm show={true} onClose={onCloseMock} task={{
      ...task,
      locked: false,
    }}/>)
    const deleteBtn = await screen.getByTestId('delete-button')
    expect(deleteBtn).toBeVisible()
    await act(async () => {
      await userEvent.click(deleteBtn)
    })

    const confirmDeleteBtn = await screen.getByTestId('confirm-delete-button')
    expect(confirmDeleteBtn).toBeVisible()

    await act(async () => {
      await userEvent.click(confirmDeleteBtn)
    })

    expect(onCloseMock).toHaveBeenCalledTimes(1)

  })


})


