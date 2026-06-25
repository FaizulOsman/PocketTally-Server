/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, RequestHandler, Response } from 'express';
import { FormDataService } from './formData.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { formDataFilterableFields } from './formData.constants';
import { paginationFields } from '../../../constants/pagination';
import { Secret } from 'jsonwebtoken';
import config from '../../../config';
import { pick } from '../../../shared/pick';
import { jwtHelpers } from '../../../helper/jwtHelpers';
import { Form } from '../form/form.model';
import ApiError from '../../../errors/apiError';
import PDFDocument from 'pdfkit-table';

// Create
const createData: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const token: any = req.headers.authorization;
    const verifiedUser = jwtHelpers.verifyToken(
      token,
      config.jwt.secret as Secret
    );

    const { ...formData } = req.body;

    const result = await FormDataService.createData(formData, verifiedUser);

    // Send Response
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Data Created Successfully',
      data: result,
    });
  }
);

// Get all
const getAllData: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, formDataFilterableFields);
    const paginationOptions = pick(req.query, paginationFields);

    const findForm = await Form.findById(filters.form);
    if (!findForm) throw new ApiError(httpStatus.NOT_FOUND, 'Tally Not Found');

    const result = await FormDataService.getAllData(filters, paginationOptions);

    // Send Response
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Data retrieved Successfully',
      meta: result.meta,
      data: result.data,
    });
  }
);

// Get single
const getSingleData: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const token: any = req.headers.authorization;
    const verifiedUser = jwtHelpers.verifyToken(
      token,
      config.jwt.secret as Secret
    );

    const id = req.params.id;
    const result = await FormDataService.getSingleData(verifiedUser, id);

    // Send Response
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Get Single Data Successfully',
      data: result,
    });
  }
);

// Update
const updateData: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;
  const updateData = req.body;

  const result = await FormDataService.updateData(id, updateData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Data updated successfully',
    data: result,
  });
});

// Delete Single
const deleteData: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await FormDataService.deleteData(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Data deleted successfully',
    data: result,
  });
});

// Delete Many
const deleteMany: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await FormDataService.deleteMany(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Data deleted successfully',
    data: result,
  });
});

// Export PDF
const exportPDF: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, formDataFilterableFields);

    const findForm = await Form.findById(filters.form);
    if (!findForm) throw new ApiError(httpStatus.NOT_FOUND, 'Tally Not Found');

    const formFields = findForm.formData || [];
    const headers = ['Sr. No', ...formFields.map((field: any) => field.name)];

    // Fetch all matching data (with large limit to fetch all)
    const result = await FormDataService.getAllData(filters, {
      limit: 1000000,
      page: 1,
    });

    const rows = result.data.map((item, index) => {
      let parsedData: any = {};
      if (item.data) {
        try {
          parsedData = JSON.parse(item.data);
        } catch (e) {
          // ignore
        }
      }

      const rowValues = formFields.map((field: any) => {
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
      ...formFields.map((field: any) => {
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

    const doc = new PDFDocument({ margin: 30, size: 'A4' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `inline; filename="${findForm.formName.replace(/\s+/g, '_')}.pdf"`
    );

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

    await doc.table(table, {
      columnsSize: [40, ...formFields.map(() => '*' as const)],
      prepareHeader: () => doc.font('Helvetica-Bold').fontSize(9),
      prepareRow: (row: any, index?: number) => {
        doc.font('Helvetica').fontSize(9);
        if (index === rows.length - 1) {
          doc.font('Helvetica-Bold');
        }
      },
    });

    doc.end();
  }
);

export const FormDataController = {
  createData,
  getAllData,
  getSingleData,
  updateData,
  deleteData,
  deleteMany,
  exportPDF,
};
