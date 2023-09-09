import { styled } from "../../styles";


export const TasksContainer = styled('div', {
  background: 'rgba(0,0,0,0.10)',
  borderRadius: '8px',
  padding: '3rem 1rem 1rem 1rem',
  display: 'flex',
  flexWrap: 'wrap',
  flexDirection: 'row',
  justifyContent: 'center',
  gap: '2rem',
  position: 'relative',
  marginBottom: '1rem',
})

export const ToolBar = styled('div', {
  margin: '1rem 0',
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: '1rem',
})

export const TaskContainerTitle = styled('div', {
  position: 'absolute',
  top: 0,
  left: 0,
  background: '$white',
  borderBottomRightRadius: '8px',
  borderTopLeftRadius: '8px',
  padding: '0rem 1rem',
  fontWeight: '500',
  fontSize: '1.25rem',
})