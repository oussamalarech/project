/**
 * Restricts access to admin-only routes.
 * Must be used after protect middleware so req.user is set.
 */
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admin privileges required.' });
  }
};

module.exports = admin;
