export default function checkRole(...allowedRoles) {
  return (req, res, next) => {
    const user = req.user;
    if (!user || !user.role) {
      return res.status(403).json({ success: false, message: 'Acceso denegado' });
    }

    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({ success: false, message: 'Rol no autorizado' });
    }

    return next();
  };
}
