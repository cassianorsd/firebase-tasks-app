import { styled } from "../../styles";



export const UsersBoxContainer = styled('div',{
  position: 'fixed',
  margin: 0,
  bottom: 5,
  left: 5,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  width: '14rem',
})

export const Button = styled('button', {
  all: 'unset',
  borderRadius: '6px',
  backgroundColor: '#2b2d42',
  color:'$white',
  padding: '0.5rem 1rem',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    cursor: 'pointer',
    backgroundColor: '#3d3f58'
  },
  variants: {
    active: {
      true: {
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
      },
      false: {
      }
    }
  },
  defaultVariants: {
    active: false
  },
})

export const UsersPanel = styled('ul', {
  transition: 'all 0.2s ease-in-out',
  with: '100%',
  background: '#3d3f58',
  overflow: 'hidden',
  borderTopLeftRadius: 6,
  borderTopRightRadius: 6,
  color:'$white',
  padding: '0.5rem 1rem',
  margin: 0,
  listStyle: 'none',
  fontSize: '0.75rem',
  li: {
    padding: '0.25rem 0',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  variants: {
    isOpen: {
      true: {
        padding: '0.5rem 1rem',
        maxHeight: '20rem',
      },
      false: {
        padding: '0 1rem',
        maxHeight: '0',
      }
    }
  },
  defaultVariants: {
    isOpen: false
  },
})

export const Avatar = styled('div', {
  variants: {
    online: {
      true: {
        backgroundColor: '$green300',
      },
      false: {
        backgroundColor: '$red600',
      }
    }
  },
  defaultVariants: {
    online: false
  },
  img: {
    width: '25px',
    height: '25px',
    borderRadius: '999px',
  },
  width: '27px',
  height: '27px',
  borderRadius: '999px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flex: '0 0 auto',
})