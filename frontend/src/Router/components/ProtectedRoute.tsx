import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { styled } from "../../styles";
import { Spinner } from "react-bootstrap";

const LoadingFrame = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
  width: '100%'
})

interface ProtectedRouteProps {
  children: React.ReactNode
}

function ProtectedRoute({children} : ProtectedRouteProps) {
  const { user, isAuthenticating } = useAuth()

  if(!user && isAuthenticating){
    return <LoadingFrame>
      <Spinner animation="grow" variant="light" />
    </LoadingFrame>
  }

  if(!user && !isAuthenticating){
    return <Navigate to="/"/>
  }

  return children
}

export default ProtectedRoute;