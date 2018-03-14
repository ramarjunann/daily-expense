class AddCategoryToExpenses < ActiveRecord::Migration[5.1]
  def change
    add_column :expenses, :category, :integer, null: false, default: 0
  end
end
