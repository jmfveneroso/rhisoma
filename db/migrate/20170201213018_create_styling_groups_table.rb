class CreateStylingGroupsTable < ActiveRecord::Migration[5.0]
  def change
    create_table :styling_groups do |t|
      t.references :user, foreign_key: true
      t.string :color
    end

    add_column :nodes, :styling_group_id,  :integer
  end
end
