class AddEmailDigestToUsers < ActiveRecord::Migration[5.0]
  def change
    add_column :users, :email_reset_digest, :string
    add_column :users, :new_email, :string
    add_column :users, :email_reset_sent_at, :datetime
  end
end
