export const messageErrorPasser = (error: any) => {
  const result = [];
  error.map((err) => {
    err.constraints
      ? result.push({
          fieldName: err.property,
          message: Object.values(err.constraints).join(', '),
        })
      : err.children[0].children.map((subErr) => {
          result.push({
            fieldName: subErr.property,
            message: Object.values(subErr.constraints).join(', '),
          });
        });
  });
  return result;
};
