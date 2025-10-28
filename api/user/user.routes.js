import express from 'express'

import { requireAuth, requireAdmin } from '../../middlewares/requireAuth.middleware.js'
import { getUser, getUsers, deleteUser, updateUser, getUserLikes, addUserLike, removeUserLike } from './user.controller.js'

const router = express.Router()

router.get('/', getUsers)
router.get('/:id', getUser)
router.put('/:id', requireAuth, updateUser)
router.delete('/:id', requireAuth, requireAdmin, deleteUser)

router.get('/likes', requireAuth, getUserLikes)
router.post('/likes', requireAuth, addUserLike)
router.delete('/likes/:songId', requireAuth, removeUserLike)

export const userRoutes = router