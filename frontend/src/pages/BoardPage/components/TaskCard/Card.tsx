import { useState } from "react";
import { styled } from "../../../../styles";
import { EditTaskForm } from "../../../../components/EditTaskForm";
import { Task } from "../../../../shared/interfaces/task";


const CardContainer = styled('button', {
  'all': 'unset',
  padding: '0.5rem',
  backgroundColor: '$white',
  borderRadius: '4px',
  boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
  transition: 'all 0.1s ease-in-out',
  display: 'flex',
  flexDirection: 'column',
  fontSize: '0.8275rem',
  gap: '0.5rem',
  boxSizing: 'border-box',
  wordWrap: 'break-word',
  '&:hover': {
    cursor: 'pointer',
    backgroundColor: '$gray100',
    marginTop: '-0.25rem',
  },
  width: '17rem',
  height: '11rem',
  '@media only screen and (max-width: 768px)': {
    width: '100%',
  },
  p: {
    overflow: 'hidden',
    margin: 0
  }
})

interface CardProps  {
  children: React.ReactNode;
  edit?: boolean;
  task: Task;
}


export function Card({children,edit = false,task}: CardProps) {
  const [showEditForm, setShowEditForm] = useState(false);

  const handleOnClick = () => {
    if (edit) {
      setShowEditForm(true);
    }
  }

  const handleClose = () => {
    setShowEditForm(false);
  }


  return (
    <>
      <CardContainer onClick={handleOnClick}>
        {children}
      </CardContainer>
      {edit && (
        <EditTaskForm onClose={handleClose} show={showEditForm} task={task} />
      )}
    </>
  );
}
