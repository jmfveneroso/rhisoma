require 'test_helper'

class NodeGroupTest < ActiveSupport::TestCase
  def setup
    @user = users(:basic_user)
    @node_group = NodeGroup.new(name: "Node Group Name", user_id: @user.id)
  end

  test "node group should be valid" do
    assert @node_group.valid?
  end

  test "name should be present" do
    @node_group.name = "     "
    assert_not @node_group.valid?
  end

  test "user should be valid" do
    @node_group.user_id = -1
    assert_not @node_group.valid?
  end

  test "should delete node group nodes" do
    @node_group_2 = node_groups(:one)

    assert_difference 'Node.count', -3 do
      @node_group_2.destroy
    end
  end
end
