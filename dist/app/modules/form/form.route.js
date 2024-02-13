"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormRoutes = void 0;
const express_1 = __importDefault(require("express"));
const form_controller_1 = require("./form.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const form_validation_1 = require("./form.validation");
const router = express_1.default.Router();
// Routes
router.post('/create-form', (0, validateRequest_1.default)(form_validation_1.FormValidation.createFormZodValidation), form_controller_1.FormController.createForm);
router.get('/:id', form_controller_1.FormController.getSingleForm);
router.delete('/:id', form_controller_1.FormController.deleteForm);
router.patch('/:id', (0, validateRequest_1.default)(form_validation_1.FormValidation.updateFormZodValidation), form_controller_1.FormController.updateForm);
router.get('/', form_controller_1.FormController.getAllForms);
exports.FormRoutes = router;
