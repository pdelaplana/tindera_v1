export const ErrorMessages = {
  signup: {
    username: [
      { type: 'required', message: 'Username is required'},
      { type: 'minlength', message: 'Username length must be longer than or equal to 6 characters '},
      { type: 'maxlength', message: 'Username length Cannot exceed 20 characters '},
      { type: 'pattern', message: 'Please enter valid Username format '}
    ],
    email: [
      { type: 'required', message: 'Email is required'},
      { type: 'minlength', message: 'Email length must be longer than or equal to 6 characters '},
      { type: 'maxlength', message: 'Email length Cannot exceed 20 characters '},
      { type: 'pattern', message: 'Please enter valid email format '}
    ],
    password: [
      { type: 'required', message: 'Password is required'},
      { type: 'minlength', message: 'Password length must be longer than or equal to 6 characters '},
      { type: 'maxlength', message: 'Password length Cannot exceed 10 characters '},
      { type: 'pattern', message: 'Password must contain numbers,uppercase and lowercase letters '}
    ],
    confirmPassword: [
      { type: 'required', message: 'Password is required'},
      { type: 'minlength', message: 'Password length must be longer than or equal to 6 characters '},
      { type: 'maxlength', message: 'Password length Cannot exceed 10 characters '},
      { type: 'pattern', message: 'Password must contain numbers,uppercase and lowercase letters '},
      { type: 'notSame', message: 'Password must match '}
    ],
  },
  login: {
    username: [
      { type: 'required', message: 'Username is required'},
      { type: 'minlength', message: 'Username length must be longer than or equal to 6 characters '},
      { type: 'maxlength', message: 'Username length cannot exceed 20 characters '},
      { type: 'pattern', message: 'Please enter valid Username format '},
      { type: 'loginFailed', message: 'Login failed. Please enter a valid email address.'}
    ],
    password: [
      { type: 'required', message: 'Password is required'},
      { type: 'minlength', message: 'Password length must be longer than or equal to 6 characters '},
      { type: 'maxlength', message: 'Password length Cannot exceed 10 characters '},
      { type: 'pattern', message: 'Password must contain numbers,uppercase and lowercase letters '},
      { type: 'loginFailed', message: 'Login failed. Please enter a valid password.'}
    ]
  },
  storeSetup: {
    name: [
      { type: 'required', message: 'Name is required'},
      { type: 'maxlength', message: 'Name length Cannot exceed 20 characters '}
    ]
  }
  
};
