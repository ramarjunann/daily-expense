export class Expense {
 constructor(
   public id?: string,
   public description?: string,
   public amount?: number,
   public user_id?: string,
   public category?: string,
   public created_at?: any
 ) {}
}
