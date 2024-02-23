import express from 'express';
import { FormDataController } from './formData.controller';

const router = express.Router();

// Routes
router.post('/create', FormDataController.createData);

router.delete('/delete-many/:id', FormDataController.deleteMany);

router.get('/:id', FormDataController.getSingleData);

router.delete('/:id', FormDataController.deleteData);

router.patch('/:id', FormDataController.updateData);

router.get('/', FormDataController.getAllData);

export const FormDataRoutes = router;
