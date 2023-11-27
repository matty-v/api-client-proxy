import axios from "axios";
import cors from 'cors';
import express, { Request, RequestHandler, Response } from 'express';
import morgan from 'morgan';
import authFilter from "./auth-filter";
import { ProxyRequest } from './types';

const apiClientProxy = express();

apiClientProxy.use(express.json());
apiClientProxy.use(express.urlencoded({ extended: true }));
apiClientProxy.use(cors({origin: true}));
apiClientProxy.use(morgan('tiny'));

apiClientProxy.get('/', (async (_: Request, res: Response) => {
  res.json({ health: 'OK' });
}) as RequestHandler);

apiClientProxy.post('/post-test', (async (req: Request, res: Response) => {

  const body = req.body;
  const headers = req.headers;

  res.json({ "body": body, "headers": headers });
}) as RequestHandler);

apiClientProxy.use(authFilter);

apiClientProxy.post('/proxy', (async (req: Request, res: Response) => {

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
}) as RequestHandler);

apiClientProxy.listen(3001, () => {
  console.log(`API client proxy is listening on port 3001...`);
});

exports.apiClientProxy = apiClientProxy;
