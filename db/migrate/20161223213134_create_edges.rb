class CreateEdges < ActiveRecord::Migration[5.0]
  def change
    create_table :edges, :force => true do |t|
      t.integer "source_id", :null => false
      t.integer "target_id", :null => false
      t.string :category
    end
  end
end
