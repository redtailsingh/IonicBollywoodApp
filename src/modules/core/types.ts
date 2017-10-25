export type NormalizedResponse = {
  entities: any;
  result: any;
};

export interface Action {
  type: string,
  payload?: any,
  response?: NormalizedResponse
}
