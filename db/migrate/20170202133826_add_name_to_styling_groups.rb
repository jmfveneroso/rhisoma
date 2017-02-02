class AddNameToStylingGroups < ActiveRecord::Migration[5.0]
  def change
    add_column :styling_groups, :name, :string
  end
end
