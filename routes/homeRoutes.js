import express from 'express';
import {renderHome} from '../controllers/homeController.js';

const router = express.Router();

router.get('/',renderHome)

export default router;