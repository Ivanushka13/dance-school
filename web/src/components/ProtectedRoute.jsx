import {useSelector} from 'react-redux';
import {Navigate, Outlet} from 'react-router-dom';

function ProtectedRoute({allowedRoles, redirectTo = '/login'}) {
  const session = useSelector((state) => state.session);
  const isAuthenticated = !!session.id;
  const userRole = session.role;

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace/>;
  }

  if (!allowedRoles) {
    return <Outlet/>;
  }

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/not-found" replace/>;
  }

  return <Outlet/>;
}

export default ProtectedRoute;