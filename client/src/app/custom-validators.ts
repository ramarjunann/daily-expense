import { FormGroup, AbstractControl } from '@angular/forms';
import { ValidationError } from "./validation-error";

export class CustomValidators {
  static passwordMatchValidator(group: FormGroup): ValidationError {
    let password : AbstractControl = group.get('password');
    let passwordConformation : AbstractControl = group.get('password_confirmation');

    if(password.value === passwordConformation.value) {
      return null;
    }

    let error: ValidationError = {'mismatch': true};
    passwordConformation.setErrors(error);

    return error;
  }
}
