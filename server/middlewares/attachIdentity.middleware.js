export const attachIdentity = (req, res, next) => {
  if (req.user) {
    req.identity = {
      type: "user",
      id: req.user._id,
    };
  } else {
    req.identity = {
      type: "guest",
      id: req.guestId,
    };
  }
  next();
};
