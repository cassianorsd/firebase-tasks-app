import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { Link, useLocation } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import googleIcon from '../../assets/icons/google.svg'
import logo from '../../assets/logo/icons8-cursed-fire-40.png'
import { useAuth } from '../../hooks/useAuth';


export function Header() {
  const {user,signIn,signOut} = useAuth()

  const location = useLocation();

  const handleSignOut = async () => {
    if (!user) return;
    await signOut()
  }

  const handleSignIn = async () => {
    await signIn()
  }

  const { pathname } = location

  return (
    <Navbar expand="lg" className="bg-body-tertiary shadow rounded-bottom">
      <Container fluid>
        <Link to="/" className="nav-link navbar-brand d-flex p-0 align-items-center">
          <img src={logo} height={36} />
          <span>
            fireTask
          </span>
        </Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse>
          <Nav className="navbar-nav mr-auto">
            <Link 
              to="/board"
              className='nav-link'
              style={pathname === '/board' ? {color: '#5B4EF2', borderBottom:'3px solid #5B4EF2'} : {}}
            >
              Board
            </Link>
          </Nav>
        </Navbar.Collapse>
        <Navbar.Collapse className="justify-content-end gap-2">
          {user ? (
            <>
              <Navbar.Text>
                Olá{' '}
                <strong>
                  {user.displayName}
                </strong>!
              </Navbar.Text>
              <Navbar.Text>
                <Button onClick={handleSignOut} className='nav-text' size="sm" variant="danger">Sair</Button>
              </Navbar.Text>
            </>
          ) : (
            <Navbar.Text>

              <Button
                onClick={handleSignIn} 
                className='d-flex align-items-center gap-2'
                size="sm"
                variant="light">
                <img src={googleIcon} height={16} />
                Entrar
              </Button>
            </Navbar.Text>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}