import jwt from "jsonwebtoken";

export const genarateToken = (user) => {
  return jwt.sign({ user }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

export const isAuth = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.slice(7, authorization.length);
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        res.status(401).send({ msg: "Invalid Token" });
      } else {
        req.user = decode;
        next();
      }
    });
  } else {
    res.status(401).send({ msg: "No Token again" });
  }
};
