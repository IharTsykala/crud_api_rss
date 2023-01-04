export interface IReq {
  [key: string]: any;
}

export type IRes = IReq

export interface IHandler {
  (req: IReq, res: IRes): void;
}

export interface IEndpoints {
  [key: string]: { [key: string]: string | IHandler };
}

// interface IRequest {
//   (method: string, path: string, handler: () => void): void;
// }
//
// type TRequest = (method: string, path: string, handler: () => void) => void
