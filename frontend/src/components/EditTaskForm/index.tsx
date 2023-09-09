import { zodResolver } from '@hookform/resolvers/zod';
import Modal from 'react-bootstrap/Modal';
import { useForm } from 'react-hook-form';
import * as zod from 'zod'
import { firestore } from '../../config/firebase';
import { doc, updateDoc,deleteDoc } from 'firebase/firestore';
import { Button } from 'react-bootstrap';
import { useState } from 'react';
import { Task } from '../../shared/interfaces/task';
import { Trash } from '@phosphor-icons/react';
import { FirebaseError } from 'firebase/app';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/useAuth';
import { TASK_STATUS } from '../../config/constants';

const schema = zod.object({
  id: zod.string(),
  title: zod.string().nonempty({ message: 'Título é obrigatório' }),
  description: zod.string(),
  locked: zod.boolean().default(false),
  user: zod.object({
    uid: zod.string(),
    name: zod.string(),
    avatarUrl: zod.string(),
  }),
  status: zod.string(),
  squad: zod.string().optional()
})

type TaskFormData = zod.infer<typeof schema>

interface EditTaskFormProps {
  show: boolean;
  onClose: () => void;
  task: Task;
}

export function EditTaskForm({onClose,show,task}: EditTaskFormProps) {
  
  const { user } = useAuth()
  const [showDeleteConfirmation,setShowDeleteConfirmation] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    getValues
  } = useForm<TaskFormData>({
    resolver: zodResolver(schema),
    values: {
      description: task?.description,
      title: task?.title,
      locked: task?.locked,
      id: task?.id,
      user: task?.user,
      status: task?.status,
      squad: task?.squad
    }
  })


  const handleOnSubmit = async (data:TaskFormData) => {

    if (!user) {
      setError('root', {
        message: 'Você precisa estar logado para adicionar uma tarefa'
      })
      toast.error('Você precisa estar logado para adicionar uma tarefa')
      return
    }

    const { description, title, locked, status, squad } = data

    if(locked && data.user.uid !== user.uid){ 
      setError('root', {
        message: 'Você não tem permissão para editar esta tarefa'
      })
      toast.error('Você não tem permissão para editar esta tarefa')
      return
    }

    try {
      const taskRef = doc(firestore, 'todos', task.id)
      await updateDoc(taskRef, {
        description,
        title,
        locked,
        status,
        squad
      })
      toast.success('Tarefa atualizada com sucesso!')
      onClose()
    } catch (error) {
      if(error instanceof FirebaseError){
        console.log('error code',error.code)
        if(error.code === 'permission-denied'){
          toast.error('Você não tem permissão para deletar esta tarefa')
          return
        }
      }      
      toast.error('Erro ao atualizar tarefa')
    }
  }

  const handleDeleteTask = async () => {

    try {
      onClose()
      const taskRef = doc(firestore, 'todos', task.id)
      await deleteDoc(taskRef)
      toast.info('Tarefa deletada com sucesso!')
    } catch (error) {
      if(error instanceof FirebaseError){
        console.log('error code',error.code)
        if(error.code === 'permission-denied'){
          toast.error('Você não tem permissão para deletar esta tarefa')
          return
        }
      }
      console.error(error)
    }
  }

  const handleOpenDeleteConfirmation = () => {
    if(!user) return
    const { locked, user: owner } = getValues()
    if(locked && owner.uid !== user.uid){ 
      setError('root', {
        message: 'Você não tem permissão para deletar esta tarefa'
      })
      toast.error('Você não tem permissão para deletar esta tarefa')
      return
    }    
    setShowDeleteConfirmation(true)
  }

  const handleCloseDeleteConfirmation = () => {
    setShowDeleteConfirmation(false)
  }

  return (
    <>
    <Modal 
      show={show}
      onHide={onClose}
      centered
      size='lg'
    >
      <Modal.Header closeButton>
        <Modal.Title>Editar Tarefa</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form 
          onSubmit={handleSubmit(handleOnSubmit)}
          className='container'
          data-testid='task-form'
        >
          <div className="row">
            <div className="col-sm d-flex flex-column gap-4">
              <div className="form-group">
                <input 
                  type="text"
                  placeholder="Título"
                  {...register('title')} 
                  className='form-control'
                  data-testid='title-input'
                  />
                {errors.title && <span className='text-danger' data-testid='title-input-error'>{errors.title.message}</span>}
                </div>
              <div className="form-check">
                <input 
                  type="checkbox"
                  {...register('locked')}
                  id="locked"
                  className='form-check-input'
                  />
                <label 
                  className="form-check-label" 
                  htmlFor="locked"
                >
                  Travar tarefa
                </label>
                {errors.locked && <span className='text-danger'>{errors.locked.message}</span>}
              </div>
              <div className="form-group">         
                <label 
                  className="form-check-label" 
                  htmlFor="status"
                >
                  Status
                </label>     
                <select id='status' defaultValue='PENDING' className="form-select" aria-label="Selecione o status da tarefa" {...register('status')}>
                  <option value={TASK_STATUS.PENDING}>Aguardando</option>
                  <option value={TASK_STATUS.IN_PROGRESS}>Em progresso</option>
                  <option value={TASK_STATUS.DONE}>Concluída</option>
                </select>
              </div>              
              <div className="form-group">
                <label 
                  className="form-check-label" 
                  htmlFor="squad"
                >
                  Squad:
                </label>
                <input id="squad" type="text" placeholder='Squad'  className='form-control' {...register('squad')}/>
                {errors.squad && <span className='text-danger'>{errors.squad.message}</span>}
              </div>              
            </div>
            <div className="col-sm">
              <div className="form-group">
                <textarea 
                  placeholder="Descrição"
                  {...register('description')}
                  id="description"
                  className='form-control'
                  style={{
                    minHeight: '200px'
                  }}
                />
                {errors.description && <span className='text-danger'>{errors.description.message}</span>}
              </div>
            </div>
          </div>
        </form>   
      </Modal.Body>
      <Modal.Footer className='justify-content-between'>
        <Button variant='danger' size='sm' onClick={handleOpenDeleteConfirmation} data-testid='delete-button'>
          <Trash size={20}/>
        </Button>
        <div className="d-flex gap-2">
          {errors.root && <span className='ms-auto text-danger'>{errors.root.message}</span>}
          <Button variant='danger' size='sm' onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant='success' size='sm' onClick={handleSubmit(handleOnSubmit)} data-testid='submit-button'>
            Salvar
          </Button>
        </div>
      </Modal.Footer>
    </Modal> 
    <Modal show={showDeleteConfirmation} onHide={handleCloseDeleteConfirmation}>
      <Modal.Header closeButton>
        <Modal.Title>Confirmação</Modal.Title>
      </Modal.Header>
      <Modal.Body>Você tem certeza que quer deletar este registro?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseDeleteConfirmation}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={handleDeleteTask} data-testid='confirm-delete-button'>
          Deletar
        </Button>
      </Modal.Footer>
    </Modal>    
    </>
  );
}