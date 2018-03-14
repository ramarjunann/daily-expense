export class User {
 constructor(
   public id?: string,
   public email?: string,
   public password?: string,
   public password_confirmation?: string,
   public type?: string,
   public reset_password_token?: string,
   public first_name?: string,
   public last_name?: string
 ) {}
}
