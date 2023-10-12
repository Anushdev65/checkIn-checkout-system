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

// const validation = (schema) => {
//   return (req, res, next) => {
//     if (Object.keys(req.body).length === 0) {
//       // No data in the request body, proceed without validation
//       next();
//     } else {
//       const { error } = schema.validate(req.body);
//       if (!error) {
//         next();
//       } else {
//         const { details } = error;
//         console.log(details);
//         const message = details.map((value, i) => value.message).join(",");
//         let err = new Error(message);
//         err.statusCode = 422;
//         next(err); // Call `next` with an error to skip the request handling
//       }
//     }
//   };
// };
export default validation;
