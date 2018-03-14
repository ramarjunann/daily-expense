class AddAuthColumnsToUsers < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :uid, :string
    add_column :users, :auth_token_expires_at, :datetime, null: false

    add_index :users, :uid, unique: true
  end
end
