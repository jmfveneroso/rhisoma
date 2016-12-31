require 'test_helper'

class NodesControllerTest < ActionDispatch::IntegrationTest
  def setup
    @node_group = node_groups(:one)
    @node       = nodes(:node_one)
    @task_node = nodes(:node_two)
    @user       = users(:basic_user)
    @other_user = users(:second_user)
  end

  test "should return error when user not logged in" do
    post nodes_path, params: { node: { title: 'new_title' } }
    assert_response 401

    get node_path(@node)
    assert_response 401

    patch node_path(@node), params: { node: { title: 'new_title' } }
    assert_response 401

    delete node_path(@node)
    assert_response 401
  end

  test "should return error when user does not have permission" do
    log_in_as(@other_user)
    get node_path(@node)
    assert_response 403

    patch node_path(@node), params: { node: { title: 'new_title' } }
    assert_response 403

    delete node_path(@node)
    assert_response 403
  end

  test "should not create node if missing key parameters" do
    log_in_as(@user)
    assert_no_difference 'Node.count' do
      post nodes_path, params: { node: { title: '', 
                                         node_group_id: @node_group.id } }
      assert_response 400

      post nodes_path, params: { node: { title: 'abc' } }
      assert_response 400

      post nodes_path, params: { node: { title: 'abc', 
                                         node_group_id: @node_group.id,
                                         type: 'NonExistentNode' } }
      assert_response 400
    end
  end

  test "should not create node if node group does not belong to user" do
    log_in_as(@other_user)
    assert_no_difference 'Node.count' do
      post nodes_path, params: { node: { title: 'abc', 
                                         node_group_id: @node_group.id,
                                         type: 'CategoryNode' } }
      assert_response 403
    end
  end

  test "should create node" do
    log_in_as(@user)
    assert_difference 'Node.count', 1 do
      post nodes_path, params: { node: { title: 'abc', 
                                         node_group_id: @node_group.id,
                                         type: 'CategoryNode' } }
      assert_response 200
    end
  end

  test "should show a node" do
    log_in_as(@user)
    get node_path(@node)
    assert_equal @node.to_json, @response.body.to_str
  end

  test "should not update node if missing key parameters" do
    log_in_as(@user)
    old_title = @task_node.title
    patch node_path(@task_node), params: { node: { title: 'new_title', 
                                                   start_date: '' } }
    assert_response 400
    assert_equal old_title, @task_node.reload.title
  end

  test "should update node" do
    log_in_as(@user)
    old_title = @task_node.title
    patch node_path(@task_node), params: { node: { title: 'new_title' } }
    assert_response 200
    assert_not_equal old_title, @task_node.reload.title
  end

  test "should destroy node" do
    log_in_as(@user)
    delete node_path(@node)
    assert_response 200
    assert Node.where(id: @node.id).empty?
  end
end
