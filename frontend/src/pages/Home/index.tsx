
import { PROVIDERS_IDS, auth, getProvider } from '../../config/firebase';
import heroImg from '../../assets/images/hero1.png'
import { Button } from 'react-bootstrap';
import googleIcon from '../../assets/icons/google.svg'
import { signInWithPopup } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export function Home() {

  const { user } = useAuth()
  const navigate = useNavigate();

  const signInWithGoogle = async () => {
    await signInWithPopup(auth, getProvider(PROVIDERS_IDS.GOOGLE));
    navigate('/board');
  }

  return (
    <div>
      {/*  two columns, image on the left, slogan on the right, and on smaller screens is to break into vertical */}
      <div className="container">
        <div className="row">
          <div className="col-md-6 d-none d-md-block">
              <img src={heroImg} alt="Image" className="img-fluid"/>
          </div>
          <div className="col-md-6 text-white p-md-5 p-2">
            <strong className='fs-2'>
              Organize suas tarefas, <br/>
              <div style={{marginLeft:'2.5rem', color: '#FFCA2A'}}>Simplifique sua colaboração</div>
            </strong>
            { user && (
              <div className='mt-5'>
                <p>Olá, {user.displayName}!</p>
                Acesse sua <Link to='/board' className='text-white'>Board</Link>
              </div>
            )}
            { !user && (
              <>
                <p className='mt-5'>Faça login e comece a utilizar!</p>
                <div className='mt-2 d-flex justify-content-center'>
                  <Button
                      onClick={signInWithGoogle} 
                      className='d-flex align-items-center gap-2'
                      size="lg"
                      variant="light">
                      <img src={googleIcon} height={16} />
                      Entrar com Google
                  </Button>
                </div>
              </>
            )}
          </div>
          <div className="col-md-6 d-block d-md-none">
              <img src={heroImg} alt="Image" className="img-fluid"/>
          </div>
        </div>
      </div>

    </div>
  );
}