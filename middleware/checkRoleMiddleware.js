export const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      console.log('❌ User not authenticated properly');
      return res.status(401).json({ message: 'User not authenticated properly' });
    }

    // Normalize roles
    const normalizedUserRole = req.user.role.trim().toLowerCase();
    const normalizedAllowedRoles = allowedRoles.map(role => role.toLowerCase());

    console.log('🔍 Running checkRole middleware...');
    console.log('✅ Allowed roles:', normalizedAllowedRoles);
    console.log('👤 User role:', normalizedUserRole);

    // If allowedRoles is empty, allow all authenticated users
    if (normalizedAllowedRoles.length === 0) {
      console.log('✅ No role restrictions, access granted');
      return next();
    }

    if (!normalizedAllowedRoles.includes(normalizedUserRole)) {
      console.log('❌ Access denied');
      return res.status(403).json({ message: 'Access denied' });
    }

    console.log('✅ Access granted');
    next();
  };
};
