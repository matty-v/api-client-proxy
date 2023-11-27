import axios from 'axios';
import { NextFunction, Request, RequestHandler, Response, Router } from 'express';

const authFilter = Router();

let notAuthorizedResponse = {
  message: 'Not authorized!',
  referer: ''
};

const checkForIdToken = async (req: Request, res: Response, next: NextFunction) => {
  const idToken = req.headers['x-id-token'];

  if (!idToken) {
    return res.status(400).json(notAuthorizedResponse);
  }

  const idTokenUrl = `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${idToken}`;

  const response = await axios.get(idTokenUrl, {
    method: 'POST',
  });

  const data = await response.data;

  if (data && data.email !== 'matt.voget@gmail.com') {
    notAuthorizedResponse.referer = req.headers.referer;
    return res.status(400).json(notAuthorizedResponse);
  }

  req['email'] = data.email;

  next();
};

authFilter.use(checkForIdToken as RequestHandler);

export default authFilter;
