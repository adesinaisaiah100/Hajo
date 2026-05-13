const { AppError } = require('./error');

function validate(schema) {
  return function validateRequest(req, res, next) {
    const parsedBody = schema.body ? schema.body.safeParse(req.body) : { success: true, data: req.body };
    const parsedQuery = schema.query ? schema.query.safeParse(req.query) : { success: true, data: req.query };
    const parsedParams = schema.params ? schema.params.safeParse(req.params) : { success: true, data: req.params };

    const issues = [];

    if (!parsedBody.success) {
      issues.push(...parsedBody.error.issues.map((issue) => ({ source: 'body', path: issue.path.join('.'), message: issue.message })));
    }

    if (!parsedQuery.success) {
      issues.push(...parsedQuery.error.issues.map((issue) => ({ source: 'query', path: issue.path.join('.'), message: issue.message })));
    }

    if (!parsedParams.success) {
      issues.push(...parsedParams.error.issues.map((issue) => ({ source: 'params', path: issue.path.join('.'), message: issue.message })));
    }

    if (issues.length > 0) {
      return next(new AppError('Validation failed', 400, issues));
    }

    req.body = parsedBody.data;
    req.query = parsedQuery.data;
    req.params = parsedParams.data;
    return next();
  };
}

module.exports = {
  validate
};