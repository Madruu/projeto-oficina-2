import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import User from '../models/user.model.js'

const JWT_SECRET = process.env.JWT_SECRET || 'secure_secret_token'

export const login = async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ error: 'Usuário não encontrado' })

    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(400).json({ error: 'Senha incorreta' })

    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    )

    res.json({ token, role: user.role })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const register = async (req, res) => {
  const { email, password, role } = req.body

  try {
    const existing = await User.findOne({ email })
    if (existing) return res.status(400).json({ error: 'Email já cadastrado' })

    const user = new User({ email, password, role })
    await user.save()

    res.status(201).json({ message: 'Usuário criado com sucesso!' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
