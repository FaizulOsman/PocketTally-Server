"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountsRoutes = void 0;
const express_1 = __importDefault(require("express"));
const accounts_controller_1 = require("./accounts.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const accounts_validation_1 = require("./accounts.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enums/user");
const router = express_1.default.Router();
// Debtor Routes
router.post('/create-debtor', (0, auth_1.default)(user_1.ENUM_USER_ROLE.USER, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), (0, validateRequest_1.default)(accounts_validation_1.createDebtorSchema), accounts_controller_1.AccountsController.createDebtor);
router.get('/get-all-debtors', (0, auth_1.default)(user_1.ENUM_USER_ROLE.USER, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), accounts_controller_1.AccountsController.getAllDebtors);
router.get('/get-single-debtor/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.USER, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), accounts_controller_1.AccountsController.getSingleDebtor);
router.patch('/update-debtor/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.USER, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), accounts_controller_1.AccountsController.updateDebtor);
router.delete('/delete-debtor/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.USER, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), accounts_controller_1.AccountsController.deleteDebtor);
// Transaction Routes
router.post('/create-transaction', (0, auth_1.default)(user_1.ENUM_USER_ROLE.USER, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), (0, validateRequest_1.default)(accounts_validation_1.createTransactionSchema), accounts_controller_1.AccountsController.createTransaction);
router.get('/get-debtor-transactions/:debtorId', (0, auth_1.default)(user_1.ENUM_USER_ROLE.USER, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), accounts_controller_1.AccountsController.getDebtorTransactions);
router.patch('/update-transaction/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.USER, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), accounts_controller_1.AccountsController.updateTransaction);
router.delete('/delete-transaction/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.USER, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), accounts_controller_1.AccountsController.deleteTransaction);
exports.AccountsRoutes = router;
