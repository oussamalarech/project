import express from 'express'
import User from '../models/User.js'
import { protect, adminOnly } from '../middleware/authMiddleware.js'
import userRoutes from './routes/userRoutes.js'

app.use('/api/users', userRoutes)


const router = express.Router()

router.put('/:id/make-admin', protect, adminOnly, async (req, res) => {
  const user = await User.findById(req.params.id)

  if (user) {
    user.isAdmin = true
    await user.save()
    res.json({ message: 'User promoted to admin' })
  } else {
    res.status(404).json({ message: 'User not found' })
  }
})

export default router
