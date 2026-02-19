import { v4 as uuidv4 } from "uuid";

export const attachGuestId = (req, res, next) => {
  let guestId = req.cookies?.guestId;
  
  if (!guestId) {
    guestId = uuidv4();

    res.cookie("guestId", guestId, {
      httpOnly: true,
      sameSite: "lax",  
      secure: false, 
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year 
    });
  }
  req.guestId = guestId;
  next();
};
