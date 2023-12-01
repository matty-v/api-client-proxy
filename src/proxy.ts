import { HttpFunction } from '@google-cloud/functions-framework/build/src/functions';
import axios from 'axios';
import { ProxyRequest } from './types';

export const proxy: HttpFunction = async (req, res) => {

  const passedAuth = await googleAuthFilter(req, res);

  if (!passedAuth) {
    return;
  }

  const proxyRequest: ProxyRequest = req.body;

  const requestConfig = {
    url: proxyRequest.url,
    method: proxyRequest.method.toString(),
    data: proxyRequest.body,
    headers: proxyRequest.headers
  };

  const client = axios.create();

  let responseData = { status: "Failed", reason: '' };

  try {
    const response = await client.request(requestConfig);
    responseData = response.data;
  } catch (e) {
    responseData.reason = e;
  }

  res.json(responseData);
};

const googleAuthFilter = async (req, res): Promise<boolean> => {

  const notAuthorizedResponse = {
    message: 'Not authorized!'
  }

  const idToken = req.headers['x-id-token'];

  if (!idToken) {
    res.status(400).json(notAuthorizedResponse);
    return false;
  }

  const idTokenUrl = `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${idToken}`;

  const response = await axios.get(idTokenUrl, {
    method: 'POST',
  });

  const data = await response.data;

  if (data && data.email !== 'matt.voget@gmail.com') {
    res.status(400).json(notAuthorizedResponse);
    return false;
  }

  return true;
}
