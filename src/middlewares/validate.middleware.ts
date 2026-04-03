import { ZodError, ZodTypeAny } from "zod";
import { NextFunction, Request, Response } from "express";

export const validate = (schema: ZodTypeAny) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      next(error as ZodError);
    }
  };
};
