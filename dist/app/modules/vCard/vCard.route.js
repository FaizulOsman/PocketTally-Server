"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VCardRoutes = void 0;
const express_1 = __importDefault(require("express"));
const vCard_controller_1 = require("./vCard.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const vCard_validation_1 = require("./vCard.validation");
const router = express_1.default.Router();
// Routes
router.post('/create-vCard', (0, validateRequest_1.default)(vCard_validation_1.VCardValidation.createVCardZodValidation), vCard_controller_1.VCardController.createVCard);
router.get('/:id', vCard_controller_1.VCardController.getSingleVCard);
router.delete('/:id', vCard_controller_1.VCardController.deleteVCard);
router.patch('/:id', (0, validateRequest_1.default)(vCard_validation_1.VCardValidation.updateVCardZodValidation), vCard_controller_1.VCardController.updateVCard);
router.get('/', vCard_controller_1.VCardController.getAllVCards);
exports.VCardRoutes = router;
