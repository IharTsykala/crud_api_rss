import { v4 as uuidv4 } from 'uuid'
import { checkRequired, createBodyUser, getFieldsUserValidation } from '../../utils/user'

export const dataBase: { [key: string]: IUser[] | [] } = {
  users: [
    // { id: '1', name: 'hello1', age: 23, hobbies: ['sport', 'education'] },
    // { id: '2', name: 'hello2', age: 25, hobbies: ['sport'] },
  ],
}

export interface IUser {
  id: string;
  name: string;
  age: number;
  hobbies: string[] | [];
}

// interface ICheckUserFields {
//   (props: { user: IUser }): boolean;
// }

export class UserService {
  static getUsers() {
    return {
      code: 200,
      users: dataBase.users,
    }
  }

  static getUser(id: string) {
    const currentUser = dataBase.users.find((user) => user.id === id)
    const regexExpUUID = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi
    const testUUID = regexExpUUID.test(id)
    if (!testUUID) {
      return {
        code: 400,
        message: 'id needed to be uuid',
      }
    }

    if (!currentUser) {
      return {
        code: 404,
        message: 'Is not exist user with this id',
      }
    }
    return { code: 200, user: currentUser }
  }

  static addUser(user: IUser) {
    if (!user) {
      return {
        code: 400,
        message: 'Body is required',
      }
    }

    const newUser: IUser = { id: uuidv4(), ...createBodyUser(user) }

    const fieldsUserValidation = getFieldsUserValidation(newUser)
    const requiredMessage = checkRequired(fieldsUserValidation, 'required', 'requiredMessage')
    if (requiredMessage) {
      return {
        code: 400,
        message: requiredMessage,
      }
    }

    const validationRulesMessage = checkRequired(fieldsUserValidation, 'validationRules', 'validationMessage')
    if (validationRulesMessage) {
      return {
        code: 400,
        message: validationRulesMessage,
      }
    }

    // @ts-ignore
    dataBase.users.push(newUser)

    return {
      code: 201,
      message: 'User was successfully added',
    }
  }

  static updateUser(id: string, user: IUser) {
    if (!user) {
      return {
        code: 400,
        message: 'Body is required',
      }
    }

    const currentUser: IUser | undefined = dataBase.users.find((user) => user.id === id)
    const fieldsUserValidation = getFieldsUserValidation({ ...createBodyUser(user), id })

    const regexExpUUID = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi
    const testUUID = regexExpUUID.test(id)
    if (!testUUID) {
      return {
        code: 400,
        message: 'id needed to be uuid',
      }
    }

    if (!currentUser) {
      return {
        code: 404,
        message: 'Is not exist user with this id',
      }
    }
    const requiredMessage = checkRequired(fieldsUserValidation, 'required', 'requiredMessage')
    if (requiredMessage) {
      return {
        code: 400,
        message: requiredMessage,
      }
    }
    const validationRulesMessage = checkRequired(fieldsUserValidation, 'validationRules', 'validationMessage')
    if (validationRulesMessage) {
      return {
        code: 400,
        message: validationRulesMessage,
      }
    }
    const newUser = { ...currentUser, ...createBodyUser(user), id }

    dataBase.users = dataBase.users.map((userDB) => (userDB.id === newUser.id ? newUser : userDB))
    return {
      code: 200,
      message: 'User was successfully updated',
    }
  }

  static deleteUser(id: string) {
    const currentUser = dataBase.users.find((user) => user.id === id)

    const regexExpUUID = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi
    const testUUID = regexExpUUID.test(id)
    if (!testUUID) {
      return {
        code: 400,
        message: 'id needed to be uuid',
      }
    }

    if (!currentUser) {
      return {
        code: 404,
        message: 'Is not exist user with this id',
      }
    }
    dataBase.users = dataBase.users.filter((user) => user.id !== id)
    return {
      code: '204',
      message: 'User was successfully removed',
    }
  }
}
