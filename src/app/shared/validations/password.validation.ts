import { AbstractControl } from '@angular/forms';

export class MatchValidation {

  static MatchField(type1: any, type2: any) {
    return (control: AbstractControl) => {
      const value1 = control.get(type1);
      const value2 = control.get(type2);

      if (value1.value === value2.value) {
        return value2.setErrors(null);
      } else {
        return value2.setErrors({ notEquivalent: true });
      }
    };
  }
}
