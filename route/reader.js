import reader from '../controller'
import express from 'express'

const router = express.Router()

const readerBase = `/reader`

router.get(`${readerBase}`, reader)

export default router
