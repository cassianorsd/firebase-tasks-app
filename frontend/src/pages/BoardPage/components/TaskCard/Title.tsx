import { styled } from "../../../../styles";


export const Title = styled('strong', {
  overflow: 'hidden',
  flex: '0 0 auto',
  maxHeight: '3rem',
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  fontSize: '1rem',
  gap: '0.25rem',
  '&::after': {
    fontSize: '0.75rem',
    borderRadius: '0.25rem',
    padding: '0rem 0.5rem',
    flex: '0 0 auto',
  },
  variants: {
    status: {
      "PENDING": {
        '&::after': {
          content: '"Aguardando"',
          backgroundColor: '$orange500',
        }
      },
      "IN_PROGRESS": {
        '&::after': {
          content: '"Em Progresso"',
          backgroundColor: '$blue300',
        }
      },
      "DONE": {
        '&::after': {
          content: '"Concluída"',
          backgroundColor: '$green300',
        }
      }
    }
  },
  defaultVariants: {
    status: "PENDING",
  }
})