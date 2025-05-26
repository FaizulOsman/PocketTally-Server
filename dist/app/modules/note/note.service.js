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
exports.NoteService = void 0;
const note_model_1 = require("./note.model");
const http_status_1 = __importDefault(require("http-status"));
const note_constants_1 = require("./note.constants");
const user_model_1 = require("../user/user.model");
const apiError_1 = __importDefault(require("../../../errors/apiError"));
const paginationHelper_1 = require("../../../helper/paginationHelper");
const mongodb_1 = require("mongodb");
// Create
const createNote = (verifiedUser, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, type } = payload;
    const findUser = yield user_model_1.User.findById(verifiedUser === null || verifiedUser === void 0 ? void 0 : verifiedUser.id);
    if (!findUser) {
        throw new apiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    const isExist = yield note_model_1.Note.find({ user: verifiedUser === null || verifiedUser === void 0 ? void 0 : verifiedUser.id, title });
    if (isExist.length > 0) {
        throw new apiError_1.default(http_status_1.default.NOT_FOUND, 'You already have a note with this title!');
    }
    const result = yield note_model_1.Note.create({
        user: verifiedUser === null || verifiedUser === void 0 ? void 0 : verifiedUser.id,
        title,
        description,
        type,
    });
    return result;
});
// Get All
const getAllNotes = (filters, paginationOptions, verifiedUser) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm, dateRange } = filters, filtersData = __rest(filters, ["searchTerm", "dateRange"]);
    const andConditions = [];
    // Add search term filtering
    if (searchTerm) {
        andConditions === null || andConditions === void 0 ? void 0 : andConditions.push({
            $or: note_constants_1.noteSearchableFields === null || note_constants_1.noteSearchableFields === void 0 ? void 0 : note_constants_1.noteSearchableFields.map(field => ({
                [field]: {
                    $regex: searchTerm,
                    $options: 'i',
                },
            })),
        });
    }
    // Add filters data conditions
    if (Object.keys(filtersData).length) {
        andConditions.push({
            $and: Object.entries(filtersData).map(([field, value]) => ({
                [field]: value,
            })),
        });
    }
    // Add date range filter if available and valid
    if (dateRange) {
        const [startDate, endDate] = dateRange
            .split('-')
            .map(date => new Date(date.trim()));
        if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
            andConditions.push({
                createdAt: {
                    $gte: startDate,
                    $lte: endDate,
                },
            });
        }
    }
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelper.calculatePagination(paginationOptions);
    const sortCondition = sortBy && sortOrder ? { [sortBy]: sortOrder } : '';
    const whereCondition = andConditions.length > 0 ? { $and: andConditions } : {};
    const query = note_model_1.Note.find((verifiedUser === null || verifiedUser === void 0 ? void 0 : verifiedUser.role) === 'admin'
        ? whereCondition
        : {
            $and: [whereCondition, { user: verifiedUser === null || verifiedUser === void 0 ? void 0 : verifiedUser.id }],
        })
        .sort(sortCondition)
        .skip(skip)
        .limit(limit);
    if ((verifiedUser === null || verifiedUser === void 0 ? void 0 : verifiedUser.role) === 'admin') {
        query.populate({ path: 'user', select: 'email' });
    }
    const result = yield query;
    const total = yield note_model_1.Note.countDocuments((verifiedUser === null || verifiedUser === void 0 ? void 0 : verifiedUser.role) === 'admin'
        ? whereCondition
        : {
            $and: [whereCondition, { user: verifiedUser === null || verifiedUser === void 0 ? void 0 : verifiedUser.id }],
        });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
// Get Single
const getSingleNote = (verifiedUser, id) => __awaiter(void 0, void 0, void 0, function* () {
    const findNote = yield note_model_1.Note.findById(id);
    if ((verifiedUser === null || verifiedUser === void 0 ? void 0 : verifiedUser.role) !== 'admin') {
        const userId = new mongodb_1.ObjectId(findNote === null || findNote === void 0 ? void 0 : findNote.user).toHexString();
        if (userId !== (verifiedUser === null || verifiedUser === void 0 ? void 0 : verifiedUser.id)) {
            throw new apiError_1.default(http_status_1.default.NOT_FOUND, 'You are not authorized to access the data!');
        }
    }
    return findNote;
});
// Update
const updateNote = (verifiedUser, id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, type } = payload;
    const findNote = yield note_model_1.Note.findById(id);
    if (!findNote) {
        throw new apiError_1.default(http_status_1.default.BAD_REQUEST, 'Note not found');
    }
    if ((verifiedUser === null || verifiedUser === void 0 ? void 0 : verifiedUser.role) !== 'admin') {
        const userId = new mongodb_1.ObjectId(findNote === null || findNote === void 0 ? void 0 : findNote.user).toHexString();
        if (userId !== (verifiedUser === null || verifiedUser === void 0 ? void 0 : verifiedUser.id)) {
            throw new apiError_1.default(http_status_1.default.NOT_FOUND, 'You are not authorized to access the data!');
        }
    }
    const result = yield note_model_1.Note.findOneAndUpdate({ _id: id }, {
        title: title || (findNote === null || findNote === void 0 ? void 0 : findNote.title),
        description: description || (findNote === null || findNote === void 0 ? void 0 : findNote.description),
        type: type || (findNote === null || findNote === void 0 ? void 0 : findNote.type),
    }, {
        new: true,
    });
    return result;
});
// Delete
const deleteNote = (id, verifiedUser) => __awaiter(void 0, void 0, void 0, function* () {
    const findNote = yield note_model_1.Note.findById(id);
    if (!findNote) {
        throw new apiError_1.default(http_status_1.default.BAD_REQUEST, 'Note not found');
    }
    if ((verifiedUser === null || verifiedUser === void 0 ? void 0 : verifiedUser.role) !== 'admin') {
        const userId = new mongodb_1.ObjectId(findNote === null || findNote === void 0 ? void 0 : findNote.user).toHexString();
        if (userId !== (verifiedUser === null || verifiedUser === void 0 ? void 0 : verifiedUser.id)) {
            throw new apiError_1.default(http_status_1.default.NOT_FOUND, 'You are not authorized to access the data!');
        }
    }
    const result = yield note_model_1.Note.findByIdAndDelete({ _id: id });
    if (!result) {
        throw new apiError_1.default(http_status_1.default.FORBIDDEN, 'Note Not Found');
    }
    return result;
});
exports.NoteService = {
    createNote,
    getAllNotes,
    getSingleNote,
    updateNote,
    deleteNote,
};
