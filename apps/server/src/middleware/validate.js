export const validate = (schema) => {
  return async (req, _res, next) => {
    await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  };
};
