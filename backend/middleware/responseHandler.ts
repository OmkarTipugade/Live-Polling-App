import type { Request, Response, NextFunction } from "express";

interface ApiResponse {
  success: boolean;
  message?: string;
  data?: any;
}

declare global {
  namespace Express {
    interface Response {
      success: (data?: any, message?: string) => Response;
      fail: (message: string, statusCode?: number) => Response;
    }
  }
}

const responseHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // success response
  res.success = (data = null, message = "OK") => {
    const response: ApiResponse = {
      success: true,
      message,
      data,
    };

    return res.status(200).json(response);
  };

  // failure response
  res.fail = (message: string, statusCode: number = 400) => {
    const response: ApiResponse = {
      success: false,
      message,
    };

    return res.status(statusCode).json(response);
  };

  next();
};

export {
    responseHandler
}