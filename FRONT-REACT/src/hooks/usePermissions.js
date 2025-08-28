import { useAuth } from '../context/AuthContext';

export const usePermissions = () => {
  const { user } = useAuth();

  const isAdmin = () => {
    return user?.rol === 'admin';
  };

  const isOwner = (resourceUserId) => {
    if (!user) return false;
    return user.id === resourceUserId;
  };

  const canEdit = (resourceUserId) => {
    if (!user) return false;
    return isAdmin() || isOwner(resourceUserId);
  };

  const canDelete = (resourceUserId) => {
    if (!user) return false;
    // Solo el admin puede eliminar, y no puede eliminarse a sí mismo
    return isAdmin() && !isOwner(resourceUserId);
  };

  const canCreate = () => {
    return isAdmin();
  };

  return {
    isAdmin,
    isOwner,
    canEdit,
    canDelete,
    canCreate,
    hasRole: (role) => user?.rol === role
  };
};
