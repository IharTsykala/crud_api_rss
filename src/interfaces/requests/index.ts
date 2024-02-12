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

export interface ISearchParams {
  [key: string]: string;
}
