const validation = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);

    if (!error) {
      next();
    } else {
      const { details } = error;
      console.log(details);
      const message = details.map((value, i) => value.message).join(",");
      let err = new Error(message);
      err.statusCode = 422;
      throw err;
    }
  };
};

export default validation;
