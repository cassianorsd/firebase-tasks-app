import { Outlet } from 'react-router-dom';
import { Header } from '../../components/Header';

function DefaultLayout() {
  return (
    <div>
      <Header />
      <div className="container pt-4 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}

export default DefaultLayout;