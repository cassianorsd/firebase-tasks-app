import { styled } from "../../../../styles";


export const Footer = styled('div', {
  borderTop: '1px solid $gray300',
  marginTop: 'auto',
  fontSize: '0.75rem',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0.25rem 0.25rem 0rem',
  div: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem'
  }
})