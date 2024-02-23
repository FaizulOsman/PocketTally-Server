"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormDataRoutes = void 0;
const express_1 = __importDefault(require("express"));
const formData_controller_1 = require("./formData.controller");
const router = express_1.default.Router();
// Routes
router.post('/create', formData_controller_1.FormDataController.createData);
router.delete('/delete-many/:id', formData_controller_1.FormDataController.deleteMany);
router.get('/:id', formData_controller_1.FormDataController.getSingleData);
router.delete('/:id', formData_controller_1.FormDataController.deleteData);
router.patch('/:id', formData_controller_1.FormDataController.updateData);
router.get('/', formData_controller_1.FormDataController.getAllData);
exports.FormDataRoutes = router;
