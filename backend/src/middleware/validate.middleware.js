export default function validate(schema) {
  return (req, res, next) => {
    const parsed = schema.parse(req.body);
    req.body = parsed;
    next();
  };
}
