"use strict";
/* eslint-disable no-console */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Script = void 0;
const formData_model_1 = require("../app/modules/formData/formData.model");
const Script = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allData = yield formData_model_1.FormData.find({ formId: '65ebd97081bb8921c5d501e9' });
        console.log('Retrieved Data:', allData === null || allData === void 0 ? void 0 : allData.length);
        for (const data of allData) {
            const parsedData = JSON.parse(data.data);
            console.log(parsedData);
            // Update the document in the database
            // await FormData.updateOne(
            //   { _id: data._id },
            //   {
            //     $set: {
            //       data: JSON.stringify(parsedData), // Save the updated `data` back as a JSON string
            //     },
            //   }
            // );
        }
    }
    catch (error) {
        console.error('Error updating users:', error);
    }
});
exports.Script = Script;
