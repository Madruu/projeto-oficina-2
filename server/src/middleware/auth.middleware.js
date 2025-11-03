import jwt from 'jsonwebtoken'
const JWT_SECRET = process.env.JWT_SECRET || 'segredo_super_seguro'

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader) return res.status(401).json({ error: 'Token não fornecido' })

  const token = authHeader.split(' ')[1]
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Token inválido' })
    req.user = decoded
    next()
  })
}

export const authorize = (...roles) => {
  return (req, res, next) => {
    const allowedRoles = roles.map(r => String(r).toLowerCase())
    const userRole = req.user && req.user.role ? String(req.user.role).toLowerCase() : ''
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ error: 'Acesso negado' })
    }
    next()
  }
}
