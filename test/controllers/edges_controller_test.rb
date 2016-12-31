require 'test_helper'

class EdgesControllerTest < ActionDispatch::IntegrationTest
  def setup
    @node_one   = nodes(:node_one)
    @node_two   = nodes(:node_two)
    @node_four  = nodes(:node_four)
    @edge       = edges(:edge_one)
    @user       = users(:basic_user)
    @other_user = users(:second_user)
  end

  test "should return error when user not logged in" do
    post edges_path, params: { }
    assert_response 401

    get edge_path(@edge)
    assert_response 401

    patch edge_path(@edge), params: { }
    assert_response 401

    delete edge_path(@edge)
    assert_response 401
  end

  test "should return error when user does not have permission" do
    log_in_as(@other_user)
    get edge_path(@edge)
    assert_response 403

    patch edge_path(@edge), params: { edge: { category: 'Dependency' } }
    assert_response 403

    delete edge_path(@edge)
    assert_response 403
  end

  test "should not create edge if nodes do not belong to user" do
    log_in_as(@other_user)
    assert_no_difference 'Edge.count' do
      post edges_path, params: { edge: { category: 'Dependency', 
                                         source_id: @node_one.id,
                                         target_id: @node_two.id } }
      assert_response 403
    end
  end

  test "should create edge" do
    log_in_as(@user)
    assert_difference 'Edge.count', 1 do
      post edges_path, params: { edge: { category: 'Dependency', 
                                         source_id: @node_one.id,
                                         target_id: @node_two.id } }
      assert_response 200
    end
  end

  test "should show an edge" do
    log_in_as(@user)
    get edge_path(@edge)
    assert_equal @edge.to_json, @response.body.to_str
  end

  test "should not update node if source or target do not belong to user" do
    log_in_as(@user)
    old = @edge.category
    patch edge_path(@edge), params: { edge: { source_id: @node_four.id, 
                                              category: 'Dependency' } }
    assert_response 403
    assert_equal old, @edge.reload.category
  end

  test "should update node" do
    log_in_as(@user)
    old = @edge.category
    patch edge_path(@edge), params: { edge: { category: 'Dependency' } }
    assert_response 200
    assert_not_equal old, @edge.reload.category
  end

  test "should destroy edge" do
    log_in_as(@user)
    delete edge_path(@edge)
    assert_response 200
    assert Edge.where(id: @edge.id).empty?
  end
end
