export type ProxyRequest = {
  url: string;
  method: ProxyMethod;
  body?: any;
  headers?: any;
};

export enum ProxyMethod {
  'GET',
  'POST'
}
