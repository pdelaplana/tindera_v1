export type QueryOperator =
  '<' | '<=' | '==' | '!=' | '>=' | '>' | 'array-contains' | 'in' | 'array-contains-any' | 'not-in'

  export interface QueryParameter {
    name: string;
    operator: QueryOperator;
    value: any;
  }