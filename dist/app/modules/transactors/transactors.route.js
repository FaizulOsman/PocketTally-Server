"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactorsRoutes = void 0;
const express_1 = __importDefault(require("express"));
const transactors_controller_1 = require("./transactors.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const transactors_validation_1 = require("./transactors.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enums/user");
const router = express_1.default.Router();
// Transactor Routes
router.post('/create-transactor', (0, auth_1.default)(user_1.ENUM_USER_ROLE.USER, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), (0, validateRequest_1.default)(transactors_validation_1.createTransactorSchema), transactors_controller_1.TransactorsController.createTransactor);
router.get('/get-all-transactors', (0, auth_1.default)(user_1.ENUM_USER_ROLE.USER, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), transactors_controller_1.TransactorsController.getAllTransactors);
router.get('/get-single-transactor/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.USER, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), transactors_controller_1.TransactorsController.getSingleTransactor);
router.patch('/update-transactor/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.USER, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), transactors_controller_1.TransactorsController.updateTransactor);
router.delete('/delete-transactor/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.USER, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), transactors_controller_1.TransactorsController.deleteTransactor);
// Transaction Routes
router.post('/create-transaction', (0, auth_1.default)(user_1.ENUM_USER_ROLE.USER, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), (0, validateRequest_1.default)(transactors_validation_1.createTransactionSchema), transactors_controller_1.TransactorsController.createTransaction);
router.get('/get-transactor-transactions/:transactorId', (0, auth_1.default)(user_1.ENUM_USER_ROLE.USER, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), transactors_controller_1.TransactorsController.getTransactorTransactions);
router.patch('/update-transaction/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.USER, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), transactors_controller_1.TransactorsController.updateTransaction);
router.delete('/delete-transaction/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.USER, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), transactors_controller_1.TransactorsController.deleteTransaction);
// Get Transactors Total
router.get('/get-transactors-total', (0, auth_1.default)(user_1.ENUM_USER_ROLE.USER, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), transactors_controller_1.TransactorsController.getTransactorsTotal);
exports.TransactorsRoutes = router;
