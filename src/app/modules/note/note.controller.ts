/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, RequestHandler, Response } from 'express';
import { NoteService } from './note.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { INote } from './note.interface';
import { noteFilterableFields } from './note.constants';
import { paginationFields } from '../../../constants/pagination';
import { Secret } from 'jsonwebtoken';
import config from '../../../config';
import { pick } from '../../../shared/pick';
import { jwtHelpers } from '../../../helper/jwtHelpers';

// Create Note
const createNote: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { ...payload } = req.body;

    const token: any = req.headers.authorization;
    const verifiedUser = jwtHelpers.verifyToken(
      token,
      config.jwt.secret as Secret
    );

    const result = await NoteService.createNote(verifiedUser, payload);

    // Send Response
    sendResponse<INote>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Note Created Successfully',
      data: result,
    });
  }
);

// Get all Notes
const getAllNotes: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, noteFilterableFields);
    const paginationOptions = pick(req.query, paginationFields);

    const token: any = req.headers.authorization;
    const verifiedUser = jwtHelpers.verifyToken(
      token,
      config.jwt.secret as Secret
    );

    const result = await NoteService.getAllNotes(
      filters,
      paginationOptions,
      verifiedUser
    );

    // Send Response
    sendResponse<INote[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Note retrieved Successfully',
      meta: result.meta,
      data: result.data,
    });
  }
);

// Get single Note by id
const getSingleNote: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const token: any = req.headers.authorization;
    const verifiedUser = jwtHelpers.verifyToken(
      token,
      config.jwt.secret as Secret
    );

    const id = req.params.id;
    const result = await NoteService.getSingleNote(verifiedUser, id);

    // Send Response
    sendResponse<INote>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Get Single Note Successfully',
      data: result,
    });
  }
);

// Update Note
const updateNote: RequestHandler = catchAsync(async (req, res) => {
  const noteId = req.params.id;
  const updateData = req.body;

  const token: any = req.headers.authorization;
  const verifiedUser = jwtHelpers.verifyToken(
    token,
    config.jwt.secret as Secret
  );

  const result = await NoteService.updateNote(verifiedUser, noteId, updateData);

  sendResponse<INote>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Note updated successfully',
    data: result,
  });
});

// Delete Note
const deleteNote: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;

  const token: any = req.headers.authorization;
  const verifiedUser = jwtHelpers.verifyToken(
    token,
    config.jwt.secret as Secret
  );

  const result = await NoteService.deleteNote(id, verifiedUser);

  sendResponse<INote>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Note deleted successfully',
    data: result,
  });
});

export const NoteController = {
  createNote,
  getAllNotes,
  getSingleNote,
  updateNote,
  deleteNote,
};
