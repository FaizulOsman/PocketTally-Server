"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesRoutes = void 0;
const express_1 = __importDefault(require("express"));
const sales_controller_1 = require("./sales.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const sales_validation_1 = require("./sales.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enums/user");
const router = express_1.default.Router();
// =========================================================
// Monthly Sales Routes
// =========================================================
router.post('/monthly/create', (0, auth_1.default)(user_1.ENUM_USER_ROLE.USER, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), (0, validateRequest_1.default)(sales_validation_1.SalesValidation.createSalesMonthlyZodValidation), sales_controller_1.SalesController.createSalesMonthly);
router.get('/monthly/get-all', (0, auth_1.default)(user_1.ENUM_USER_ROLE.USER, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), sales_controller_1.SalesController.getAllSalesMonthly);
router.get('/monthly/get-single/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.USER, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), sales_controller_1.SalesController.getSingleSalesMonthly);
router.patch('/monthly/update/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.USER, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), (0, validateRequest_1.default)(sales_validation_1.SalesValidation.updateSalesMonthlyZodValidation), sales_controller_1.SalesController.updateSalesMonthly);
router.delete('/monthly/delete/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.USER, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), sales_controller_1.SalesController.deleteSalesMonthly);
// =========================================================
// Daily Sales Routes
// =========================================================
router.post('/daily/create', (0, auth_1.default)(user_1.ENUM_USER_ROLE.USER, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), (0, validateRequest_1.default)(sales_validation_1.SalesValidation.createSalesDailyZodValidation), sales_controller_1.SalesController.createSalesDaily);
router.get('/daily/get-all', (0, auth_1.default)(user_1.ENUM_USER_ROLE.USER, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), sales_controller_1.SalesController.getAllSalesDaily);
router.get('/daily/get-single/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.USER, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), sales_controller_1.SalesController.getSingleSalesDaily);
router.patch('/daily/update/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.USER, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), (0, validateRequest_1.default)(sales_validation_1.SalesValidation.updateSalesDailyZodValidation), sales_controller_1.SalesController.updateSalesDaily);
router.delete('/daily/delete/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.USER, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), sales_controller_1.SalesController.deleteSalesDaily);
exports.SalesRoutes = router;
