export interface IUser {
  id: string;
  name: string;
  age: number;
  hobbies: string[] | [];
}

interface IValidateFieldUser {
  fieldName: string;
  required: boolean;
  requiredMessage: string;
  validationRules: boolean;
  validationMessage: string;
  [key: string]: string | boolean;
}

export type TValidateFieldsUser = IValidateFieldUser[]
