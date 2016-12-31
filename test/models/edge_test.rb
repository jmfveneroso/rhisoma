require 'test_helper'

class EdgeTest < ActiveSupport::TestCase
  def setup
    @node_one = nodes(:node_one)
    @node_two = nodes(:node_two)
    @node_three = nodes(:node_three)
    @edge_one = edges(:edge_one)

    @edge = Edge.new(source_id: @node_one.id, target_id: @node_two.id, 
      category: 'Positioning')
  end

  test "edge should be valid" do
    assert @edge.valid?
  end

  test "category should be valid" do
    @edge.category = "     "
    assert_not @edge.valid?
  end

  test "source should exist" do
    @edge.source_id = -1
    assert_not @edge.valid?
  end

  test "target should exist" do
    @edge.target_id = -1
    assert_not @edge.valid?
  end

  test "source should not be the same as target" do
    @edge.source_id = @edge.target_id
    assert_not @edge.valid?
  end

  test "should not be valid if the reversed connection already exists" do
    @edge.source_id = @edge_one.target_id
    @edge.target_id = @edge_one.source_id
    assert_not @edge.valid?
  end
end
