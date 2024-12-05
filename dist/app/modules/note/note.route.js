"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoteRoutes = void 0;
const express_1 = __importDefault(require("express"));
const note_controller_1 = require("./note.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const note_validation_1 = require("./note.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enums/user");
const router = express_1.default.Router();
// Routes
router.post('/create', (0, auth_1.default)(user_1.ENUM_USER_ROLE.USER, user_1.ENUM_USER_ROLE.ADMIN), (0, validateRequest_1.default)(note_validation_1.NoteValidation.createNoteZodValidation), note_controller_1.NoteController.createNote);
router.get('/get-all', (0, auth_1.default)(user_1.ENUM_USER_ROLE.USER, user_1.ENUM_USER_ROLE.ADMIN), note_controller_1.NoteController.getAllNotes);
router.get('/get-single/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.USER, user_1.ENUM_USER_ROLE.ADMIN), note_controller_1.NoteController.getSingleNote);
router.delete('/delete/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.USER, user_1.ENUM_USER_ROLE.ADMIN), note_controller_1.NoteController.deleteNote);
router.patch('/update/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.USER, user_1.ENUM_USER_ROLE.ADMIN), note_controller_1.NoteController.updateNote);
exports.NoteRoutes = router;
