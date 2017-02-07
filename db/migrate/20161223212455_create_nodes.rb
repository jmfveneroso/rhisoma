class CreateNodes < ActiveRecord::Migration[5.0]
  def change
    create_table :nodes do |t|
      t.references :user, foreign_key: true
      t.string :title
      t.string :type
      t.boolean :active
      t.boolean :hidden

      t.timestamps
    end
  end
end
