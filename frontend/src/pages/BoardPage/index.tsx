import { useCollection } from "react-firebase-hooks/firestore";
import { TaskContainerTitle, TasksContainer, ToolBar } from "./styles";
import { query ,orderBy, collection } from "firebase/firestore";
import { firestore } from "../../config/firebase";
import { TaskCard } from "./components/TaskCard";
import { Button, Spinner } from "react-bootstrap";
import { 
  LockSimple, 
  // MagnifyingGlass,
  PlusCircle 
} from "@phosphor-icons/react";
import {  useState } from "react";
import { NewTaskForm } from "../../components/NewTaskForm";
import { useForm } from "react-hook-form";
import dayjs from "dayjs";
import { Task } from "../../shared/interfaces/task";
import { UsersBox } from "../../components/UsersBox";


interface SearchFormData {
  search: string;
}


export function BoardPage() {
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  // const [ searchQuery, setSearchQuery ] = useState('');
  const [todosSnapshot, loading, error] = useCollection(
    query(
      collection(firestore, 'todos'),
      orderBy('createdAt', 'asc')
    )
  )
  const [statusFilter, setStatusFilter] = useState('ALL' as 'DONE' | 'PENDING' | 'IN_PROGRESS' | 'ALL' )
  
  const {
    register,
    handleSubmit,
    watch
  } = useForm<SearchFormData>()  


  const handleAddNewTask = () => {
    setShowNewTaskModal(true);
  }

  const closeNewTaskModal = () => {
    setShowNewTaskModal(false);
  }

  const search = watch('search');

  // const onHandleSearch = ({search}: SearchFormData) => {
  //   setSearchQuery(search);
  // }

  const filteredTodos = todosSnapshot?.docs.filter((todo) => {
    let query = search
    if (!query && statusFilter === 'ALL') return true;
    query = query.toLowerCase()
    
    if(statusFilter !== 'ALL' && todo.data().status !== statusFilter) return false;

    const title = todo.data().title.toLowerCase();
    const description = todo.data().description ? todo.data().description.toLowerCase() : ''
    const squad = todo.data().squad ? todo.data().squad.toLowerCase() : '';
    return title.includes(query) || description.includes(query) || squad.includes(query)
  })

  const todos: Task[] = filteredTodos ? filteredTodos.map((todo) => {
    return {
      id: todo.id,
      createdAt: new Date(todo.data().createdAt.seconds*1000),
      title: todo.data().title,
      description: todo.data().description,
      locked: todo.data().locked,
      status: todo.data().status,
      squad: todo.data().squad,
      user: {
        uid: todo.data().user.uid,
        name: todo.data().user.name,
        avatarUrl: todo.data().user.avatarUrl,
      }
    }
  }) : []

  return (
    <div>
      <h2 className="text-white">
        Quadro de Atividades
      </h2>   
      <ToolBar>
        <Button 
          variant="success"
          className="me-auto"
          onClick={handleAddNewTask}
          data-testid="add-new-task-button"
        >
          Adicionar Tarefa
          <PlusCircle size={20} className="ms-1"/>
        </Button>
        <form onSubmit={handleSubmit(() => {})}>
          <div className="input-group">
            <input 
              type="text"
              className="form-control"
              placeholder="Pesquisar"
              data-testid="search-input"
              {...register('search')}
            />
            {/* <div className="input-group-append">
              <button 
                className="btn btn-info"
                type="submit"
              >
                <MagnifyingGlass size={20}/>
              </button>
            </div> */}
          </div>
        </form>
        <div>
          <select defaultValue='ALL' className="form-select" aria-label="Filtrar por status" onChange={(e) => setStatusFilter(e.target.value as 'DONE' | 'PENDING' | 'IN_PROGRESS' | 'ALL')}>
            <option value="ALL">Tudo</option>
            <option value="PENDING">Aguardando</option>
            <option value="IN_PROGRESS">Em progresso</option>
            <option value="DONE">Concluída</option>
          </select>
        </div>
      </ToolBar>
      { !search && statusFilter === 'ALL' && (
        <>
          <TasksContainer>
            <TaskContainerTitle>
              Tarefas Pendentes
            </TaskContainerTitle>
            {loading &&<Spinner animation='grow' variant='light'/>}
            {error && !loading && <span className='text-white'>Houve um erro ao carregar os dados.</span>}
            {!loading && todos && todos.filter(t=>t.status==='PENDING').map((todo) => (
              <TaskCard.Card key={todo.id} edit task={todo}>
                <TaskCard.Title status={todo.status as 'DONE' | 'PENDING' | 'IN_PROGRESS'}>
                  {todo.title}
                </TaskCard.Title>
                <TaskCard.Description>{todo.description}</TaskCard.Description>
                <TaskCard.Footer>
                  <div>
                    <TaskCard.Avatar src={todo.user.avatarUrl} alt={todo.user.name}/>
                    <span>
                    {dayjs(todo.createdAt).fromNow()}
                    </span>
                  </div>
                  {todo.locked && (
                    <div>
                      Bloqueada
                      <LockSimple size={20} color="#219ebc" weight="fill" />
                    </div>
                  )}
                </TaskCard.Footer>
              </TaskCard.Card>
            ))}
          </TasksContainer>
          <TasksContainer>
            <TaskContainerTitle>
              Tarefas em Progresso
            </TaskContainerTitle>
            {loading &&<Spinner animation='grow' variant='light'/>}
            {error && !loading && <span className='text-white'>Houve um erro ao carregar os dados.</span>}
            {!loading && todos && todos.filter(t=>t.status==='IN_PROGRESS').map((todo) => (
              <TaskCard.Card key={todo.id} edit task={todo}>
                <TaskCard.Title status={todo.status as 'DONE' | 'PENDING' | 'IN_PROGRESS'}>
                  {todo.title}
                </TaskCard.Title>
                <TaskCard.Description>{todo.description}</TaskCard.Description>
                <TaskCard.Footer>
                  <div>
                    <TaskCard.Avatar src={todo.user.avatarUrl} alt={todo.user.name}/>
                    <span>
                    {dayjs(todo.createdAt).fromNow()}
                    </span>
                  </div>
                  {todo.locked && (
                    <div>
                      Bloqueada
                      <LockSimple size={20} color="#219ebc" weight="fill" />
                    </div>
                  )}
                </TaskCard.Footer>
              </TaskCard.Card>
            ))}
          </TasksContainer>
          <TasksContainer>
            <TaskContainerTitle>
              Tarefas Concluídas
            </TaskContainerTitle>
            {loading &&<Spinner animation='grow' variant='light'/>}
            {error && !loading && <span className='text-white'>Houve um erro ao carregar os dados.</span>}
            {!loading && todos && todos.filter(t=>t.status==='DONE').map((todo) => (
              <TaskCard.Card key={todo.id} edit task={todo}>
                <TaskCard.Title status={todo.status as 'DONE' | 'PENDING' | 'IN_PROGRESS'}>
                  {todo.title}
                </TaskCard.Title>
                <TaskCard.Description>{todo.description}</TaskCard.Description>
                <TaskCard.Footer>
                  <div>
                    <TaskCard.Avatar src={todo.user.avatarUrl} alt={todo.user.name}/>
                    <span>
                    {dayjs(todo.createdAt).fromNow()}
                    </span>
                  </div>
                  {todo.locked && (
                    <div>
                      Bloqueada
                      <LockSimple size={20} color="#219ebc" weight="fill" />
                    </div>
                  )}
                </TaskCard.Footer>
              </TaskCard.Card>
            ))}
          </TasksContainer>
        </>
      )}
      { (search || statusFilter !== 'ALL') && (
        <>
        <TasksContainer>
          <TaskContainerTitle>
            Tarefas
          </TaskContainerTitle>
          {loading &&<Spinner animation='grow' variant='light'/>}
          {error && !loading && <span className='text-white'>Houve um erro ao carregar os dados.</span>}
          {!loading && todos && todos.map((todo) => (
            <TaskCard.Card key={todo.id} edit task={todo}>
              <TaskCard.Title status={todo.status as 'DONE' | 'PENDING' | 'IN_PROGRESS'}>
                {todo.title}
              </TaskCard.Title>
              <TaskCard.Description>{todo.description}</TaskCard.Description>
              <TaskCard.Footer>
                <div>
                  <TaskCard.Avatar src={todo.user.avatarUrl} alt={todo.user.name}/>
                  <span>
                  {dayjs(todo.createdAt).fromNow()}
                  </span>
                </div>
                {todo.locked && (
                  <div>
                    Bloqueada
                    <LockSimple size={20} color="#219ebc" weight="fill" />
                  </div>
                )}
              </TaskCard.Footer>
            </TaskCard.Card>
          ))}
        </TasksContainer>
        </>
      )}

      <NewTaskForm onClose={closeNewTaskModal} show={showNewTaskModal} />
      <UsersBox/>
    </div>
  );
}