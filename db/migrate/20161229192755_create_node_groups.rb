class CreateNodeGroups < ActiveRecord::Migration[5.0]
  def change
    create_table :node_groups do |t|
      t.integer "user_id", :null => false
      t.string :name
      t.boolean :public

      t.timestamps
    end
  end
end
