require 'test_helper'

class NodesControllerTest < ActionDispatch::IntegrationTest
  def setup
    @node       = nodes(:node_one)
    @other_node = nodes(:node_two)
    @third_node = nodes(:node_three)
    @user       = users(:basic_user)
    @other_user = users(:second_user)
    @edge       = edges(:edge_one)
  end

  test "should return error when user not logged in" do
    get nodes_graph_show_path
    assert_response 401

    post nodes_path, params: { node: { title: 'new_title' } }
    assert_response 401

    patch node_path(@node), params: { node: { title: 'new_title' } }
    assert_response 401

    delete node_path(@node)
    assert_response 401

    post connect_path, params: { id: 0, edge: { target_id: 0 } }
    assert_response 401

    delete disconnect_path, params: { id: 0, edge: { target_id: 0 } }
    assert_response 401
  end

  test "should return error when user does not have permission" do
    log_in_as(@other_user)
    patch node_path(@node), params: { node: { title: 'new_title' } }
    assert_response 403

    delete node_path(@node)
    assert_response 403

    post connect_path, params: { id: 0, edge: { target_id: 0 } }
    assert_response 403

    delete disconnect_path, params: { id: 0, edge: { target_id: 0 } }
    assert_response 403
  end

  test "should show graph" do
    log_in_as(@user)
    get nodes_graph_show_path

    graph = JSON.parse(@response.body)
    assert_equal 3, graph['nodes'].count
    assert_equal 1, graph['edges'].count
  end

  test "should not create node if missing key parameters" do
    log_in_as(@user)
    assert_no_difference 'Node.count' do
      post nodes_path, params: { node: { title: '' } }
      assert_response 400
    end
  end

  test "should create node" do
    log_in_as(@user)
    assert_difference 'Node.count', 1 do
      post nodes_path, params: { node: { title: 'new_title' } }
      assert_response 200
    end
  end

  test "should update node if missing key parameters" do
    log_in_as(@user)
    old_title = @node.title
    patch node_path(@node), params: { node: { title: '' } }
    assert_response 400
    assert_equal old_title, @node.reload.title
  end

  test "should update node" do
    log_in_as(@user)
    old_title = @node.title
    patch node_path(@node), params: { node: { title: 'new_title' } }
    assert_response 200
    assert_not_equal old_title, @node.reload.title
  end

  test "should destroy node" do
    log_in_as(@user)
    delete node_path(@node)
    assert_response 200
    assert Node.where(id: @node.id).empty?
  end

  test "should create edge" do
    log_in_as(@user)
    assert @node.reload.nodes.where(id: @other_node.id).empty?
    post connect_path(@node.id), params: { 
      edge: { target_id: @other_node.id } }
    assert_response 200
    assert_not @node.reload.nodes.where(id: @other_node.id).empty?
  end

  test "should destroy edge" do
    log_in_as(@user)
    assert_not @node.reload.nodes.where(id: @third_node.id).empty?
    delete disconnect_path(@node.id), params: { 
      edge: { target_id: @third_node.id } }
    assert_response 200
    assert @node.reload.nodes.where(id: @third_node.id).empty?
  end
end
