import {useSelector} from 'react-redux';
import {Navigate, Outlet} from 'react-router-dom';

function ProtectedRoute() {
  const session = useSelector((state) => state.session);
  const isAuthenticated = !!session.id;

  if (!isAuthenticated) {
    return <Navigate to='/login' replace/>;
  }

  return <Outlet/>
}

export default ProtectedRoute;