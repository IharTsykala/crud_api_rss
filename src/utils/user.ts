import { IUser } from '../services/user'

export interface IValidateFieldUser {
  fieldName: string;
  required: boolean;
  requiredMessage: string;
  validationRules: boolean;
  validationMessage: string;
  [key: string]: string | boolean;
}

export type IValidateFieldsUser = IValidateFieldUser[]

export const getFieldsUserValidation = (user: IUser) => {
  return [
    {
      fieldName: 'id',
      required: !!user.id && !!String(user.id),
      requiredMessage: 'id is required',
      validationRules: typeof user.id === 'string',
      validationMessage: 'id is needed to be string',
    },
    {
      fieldName: 'name',
      required: !!user.name && !!String(user.name),
      requiredMessage: 'name is required',
      validationRules: typeof user.name === 'string',
      validationMessage: 'name is needed to be string',
    },
    {
      fieldName: 'age',
      required: !!user.age && !!String(user.age),
      requiredMessage: 'age is required',
      validationRules: typeof user.age === 'number',
      validationMessage: 'age is needed to be number',
    },
    {
      fieldName: 'hobbies',
      required: !!user.hobbies,
      requiredMessage: 'hobbies is required',
      validationRules: Array.isArray(user.hobbies),
      validationMessage: 'hobbies is needed to be array',
    },
  ]
}

export const checkRequired = (
  validateFieldsUser: IValidateFieldsUser,
  fieldName: string,
  messageByFieldName: string
) => {
  const filterValidateFieldsUser = validateFieldsUser.filter((field) => !field[fieldName])
  if (filterValidateFieldsUser.length) {
    return filterValidateFieldsUser.map((field) => field[messageByFieldName]).toString()
  }
  return false
}
