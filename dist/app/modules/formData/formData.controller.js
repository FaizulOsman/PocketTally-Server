"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormDataController = void 0;
const formData_service_1 = require("./formData.service");
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const formData_constants_1 = require("./formData.constants");
const pagination_1 = require("../../../constants/pagination");
const config_1 = __importDefault(require("../../../config"));
const pick_1 = require("../../../shared/pick");
const jwtHelpers_1 = require("../../../helper/jwtHelpers");
const form_model_1 = require("../form/form.model");
const apiError_1 = __importDefault(require("../../../errors/apiError"));
const pdfkit_table_1 = __importDefault(require("pdfkit-table"));
// Create
const createData = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.headers.authorization;
    const verifiedUser = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.secret);
    const formData = __rest(req.body, []);
    const result = yield formData_service_1.FormDataService.createData(formData, verifiedUser);
    // Send Response
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Data Created Successfully',
        data: result,
    });
}));
// Get all
const getAllData = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.pick)(req.query, formData_constants_1.formDataFilterableFields);
    const paginationOptions = (0, pick_1.pick)(req.query, pagination_1.paginationFields);
    const findForm = yield form_model_1.Form.findById(filters.form);
    if (!findForm)
        throw new apiError_1.default(http_status_1.default.NOT_FOUND, 'Tally Not Found');
    const result = yield formData_service_1.FormDataService.getAllData(filters, paginationOptions);
    // Send Response
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Data retrieved Successfully',
        meta: result.meta,
        data: result.data,
    });
}));
// Get single
const getSingleData = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.headers.authorization;
    const verifiedUser = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.secret);
    const id = req.params.id;
    const result = yield formData_service_1.FormDataService.getSingleData(verifiedUser, id);
    // Send Response
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Get Single Data Successfully',
        data: result,
    });
}));
// Update
const updateData = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const updateData = req.body;
    const result = yield formData_service_1.FormDataService.updateData(id, updateData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Data updated successfully',
        data: result,
    });
}));
// Delete Single
const deleteData = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield formData_service_1.FormDataService.deleteData(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Data deleted successfully',
        data: result,
    });
}));
// Delete Many
const deleteMany = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield formData_service_1.FormDataService.deleteMany(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Data deleted successfully',
        data: result,
    });
}));
// Export PDF
const exportPDF = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.pick)(req.query, formData_constants_1.formDataFilterableFields);
    const findForm = yield form_model_1.Form.findById(filters.form);
    if (!findForm)
        throw new apiError_1.default(http_status_1.default.NOT_FOUND, 'Tally Not Found');
    const formFields = findForm.formData || [];
    const headers = ['Sr. No', ...formFields.map((field) => field.name)];
    // Fetch all matching data (with large limit to fetch all)
    const result = yield formData_service_1.FormDataService.getAllData(filters, {
        limit: 1000000,
        page: 1,
    });
    const rows = result.data.map((item, index) => {
        let parsedData = {};
        if (item.data) {
            try {
                parsedData = JSON.parse(item.data);
            }
            catch (e) {
                // ignore
            }
        }
        const rowValues = formFields.map((field) => {
            const val = parsedData[field.name];
            if (val === undefined || val === null) {
                return '-';
            }
            if (field.type === 'datePicker') {
                return val
                    ? new Date(val).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                    })
                    : '-';
            }
            if (field.type === 'number') {
                return typeof val === 'number'
                    ? val.toLocaleString(undefined, {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2,
                    })
                    : '-';
            }
            return String(val);
        });
        return [String(index + 1), ...rowValues];
    });
    const sumData = result.meta.sumData || {};
    const totalRow = [
        'Total',
        ...formFields.map((field) => {
            const val = sumData[field.name];
            if (typeof val === 'number') {
                return val.toLocaleString(undefined, {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                });
            }
            return '-';
        }),
    ];
    rows.push(totalRow);
    const doc = new pdfkit_table_1.default({ margin: 30, size: 'A4' });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${findForm.formName.replace(/\s+/g, '_')}.pdf"`);
    doc.pipe(res);
    doc
        .font('Helvetica-Bold')
        .fontSize(20)
        .text('Pocket Tally', { align: 'center' });
    doc.moveDown(0.5);
    doc
        .font('Helvetica-Bold')
        .fontSize(14)
        .text(findForm.formName, { align: 'center' });
    doc.moveDown(1.5);
    const table = {
        headers: headers,
        rows: rows,
    };
    yield doc.table(table, {
        columnsSize: [40, ...formFields.map(() => '*')],
        prepareHeader: () => doc.font('Helvetica-Bold').fontSize(9),
        prepareRow: (row, index) => {
            doc.font('Helvetica').fontSize(9);
            if (index === rows.length - 1) {
                doc.font('Helvetica-Bold');
            }
        },
    });
    doc.end();
}));
exports.FormDataController = {
    createData,
    getAllData,
    getSingleData,
    updateData,
    deleteData,
    deleteMany,
    exportPDF,
};
