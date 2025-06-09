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
// Customer Routes
router.post('/create-customer', (0, auth_1.default)(user_1.ENUM_USER_ROLE.USER, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), (0, validateRequest_1.default)(accounts_validation_1.createCustomerSchema), accounts_controller_1.AccountsController.createCustomer);
router.get('/get-all-customers', (0, auth_1.default)(user_1.ENUM_USER_ROLE.USER, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), accounts_controller_1.AccountsController.getAllCustomers);
router.get('/get-single-customer/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.USER, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), accounts_controller_1.AccountsController.getSingleCustomer);
router.patch('/update-customer/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.USER, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), accounts_controller_1.AccountsController.updateCustomer);
router.delete('/delete-customer/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.USER, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), accounts_controller_1.AccountsController.deleteCustomer);
// Transaction Routes
router.post('/create-transaction', (0, auth_1.default)(user_1.ENUM_USER_ROLE.USER, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), (0, validateRequest_1.default)(accounts_validation_1.createTransactionSchema), accounts_controller_1.AccountsController.createTransaction);
router.get('/get-customer-transactions/:customerId', (0, auth_1.default)(user_1.ENUM_USER_ROLE.USER, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), accounts_controller_1.AccountsController.getCustomerTransactions);
exports.AccountsRoutes = router;
