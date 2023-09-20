import readerController from '../controllers/reader.js'
import express from 'express'

const router = express.Router()

router.get('/', readerController.reader)

const readerRouter = router
export default readerRouter
