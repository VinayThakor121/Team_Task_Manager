import type { RequestHandler } from "express";
import type { ZodTypeAny } from "zod";

type Schema = ZodTypeAny;

export const validate = (schema: Schema): RequestHandler => {
  return async (req, _res, next) => {
    await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  };
};
