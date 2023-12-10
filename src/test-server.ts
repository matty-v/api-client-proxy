import cors from 'cors';
import express, { Request, RequestHandler, Response } from 'express';
import morgan from 'morgan';

const apiClientProxy = express();

apiClientProxy.use(express.json());
apiClientProxy.use(express.urlencoded({ extended: true }));
apiClientProxy.use(cors({ origin: true }));
apiClientProxy.use(morgan('tiny'));

apiClientProxy.post('/post-test', (async (req: Request, res: Response) => {
  const body = req.body;
  const headers = req.headers;
  res.json({ body: body, headers: headers });
}) as RequestHandler);

apiClientProxy.listen(3001, () => {
  console.log(`Test server is listening on port 3001...`);
});

exports.apiClientProxy = apiClientProxy;
