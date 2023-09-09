import { zodResolver } from '@hookform/resolvers/zod';
import Modal from 'react-bootstrap/Modal';
import { useForm } from 'react-hook-form';
import * as zod from 'zod'
import { firestore } from '../../config/firebase';
import { addDoc, collection } from 'firebase/firestore';
import { Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/useAuth';
import { TASK_STATUS } from '../../config/constants';

const schema = zod.object({
  title: zod.string().nonempty({ message: 'Título é obrigatório' }),
  description: zod.string(),
  locked: zod.boolean().default(false),
  status: zod.enum([TASK_STATUS.PENDING, TASK_STATUS.IN_PROGRESS, TASK_STATUS.DONE]),
  squad: zod.string().optional()
})

type TaskFormData = zod.infer<typeof schema>

interface NewTaskFormProps {
  show: boolean;
  onClose: () => void;
}

export function NewTaskForm({onClose,show}: NewTaskFormProps) {
  const { user } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset
  } = useForm<TaskFormData>({
    resolver: zodResolver(schema)
  })

  const handleOnSubmit = async (data:TaskFormData) => {
    if (!user) {
      setError('root', {
        message: 'Você precisa estar logado para adicionar uma tarefa'
      })
      return
    }
    const {description, title,locked, status, squad } = data
    await addDoc(collection(firestore, 'todos'), {
      title,
      description,
      locked,
      uid: user?.uid,
      createdAt: new Date(),
      status: status,
      squad: squad,
      user: {
        uid: user?.uid,
        avatarUrl: user?.photoURL,
        name: user?.displayName
      }
    })
    toast.success('Tarefa criada!')
    reset()
    onClose()
  }

  return (
    <Modal 
      show={show}
      onHide={onClose}
      centered
      size='lg'
    >
      <Modal.Header closeButton>
        <Modal.Title>Adicionar Tarefa</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form 
          onSubmit={handleSubmit(handleOnSubmit)}
          className='container'
          data-testid='new-task-form'
        >
          <div className="row">
            <div className="col-sm d-flex flex-column gap-4">
              <div className="form-group">
                <label 
                    className="form-check-label" 
                    htmlFor="title"
                  >
                  Título
                </label>                
                <input 
                    type="text"
                    placeholder="Título"
                    {...register('title')} 
                    className='form-control'
                    data-testid='title-input'
                    id='title'
                  />
                {errors.title && <span className='text-danger' data-testid='title-input-error'>{errors.title.message}</span>}
              </div>
              <div className="form-check">
                <input 
                  type="checkbox"
                  {...register('locked')}
                  id="locked"
                  className='form-check-input'
                  data-testid='locked-input'
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
                <select id='status' defaultValue='PENDING'  className="form-select" aria-label="Selecione o status da tarefa" {...register('status')}>
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
                    minHeight: '100px'
                  }}
                  data-testid='description-input'
                />
                {errors.description && <span className='text-danger'>{errors.description.message}</span>}
              </div>
            </div>
          </div>
        </form>        
      </Modal.Body>
      <Modal.Footer>
        {errors.root && <span className='text-danger'>{errors.root.message}</span>}
        <Button variant='danger' size='sm' onClick={onClose}>Cancelar</Button>
        <Button type="submit" variant='success' size='sm' onClick={handleSubmit(handleOnSubmit)} data-testid='submit-button'>
          Adicionar Tarefa
        </Button>
      </Modal.Footer>
    </Modal> 
  );
}