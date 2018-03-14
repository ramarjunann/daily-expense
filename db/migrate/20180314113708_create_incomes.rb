class CreateIncomes < ActiveRecord::Migration[5.1]
  def change
    create_table :incomes do |t|
      t.string  :uid
      t.string  :description
      t.integer :amount
      t.integer :user_id

      t.timestamps
    end
  end
end
