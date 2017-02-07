require 'test_helper'

class NodesControllerTest < ActionDispatch::IntegrationTest
  def setup
    @territory = territories(:one)
    @node       = nodes(:node_one)
    @task_node = nodes(:node_two)
    @template_node = nodes(:node_five)
    @public_node = nodes(:node_six)
    @user       = users(:basic_user)
    @other_user = users(:second_user)
  end

  test "should return error when user not logged in" do
    post nodes_path, params: { node: { title: 'new_title' } }
    assert_response 401

    get node_path(@node)
    assert_response 403

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
                                         territory_id: @territory.id } }
      assert_response 400

      post nodes_path, params: { node: { title: 'abc' } }
      assert_response 400

      post nodes_path, params: { node: { title: 'abc', 
                                         territory_id: @territory.id,
                                         type: 'NonExistentNode' } }
      assert_response 400
    end
  end

  test "should not create node if territory does not belong to user" do
    log_in_as(@other_user)
    assert_no_difference 'Node.count' do
      post nodes_path, params: { node: { title: 'abc', 
                                         territory_id: @territory.id,
                                         type: 'CategoryNode' } }
      assert_response 403
    end
  end

  test "should create node" do
    log_in_as(@user)
    assert_difference 'Node.count', 1 do
      post nodes_path, params: { node: { title: 'abc', 
                                         territory_id: @territory.id,
                                         type: 'CategoryNode' } }
      assert_response 200
    end
  end

  test "should show a node" do
    log_in_as(@user)
    get node_path(@node)

    data = JSON.parse @response.body.to_str
    assert_equal 'MyString', data['title']
    assert_equal 'CategoryNode', data['type']
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

  test "should bulk update node positions" do
    # TODO: rewrite this test and mock the stored procedure.
    # log_in_as(@user)
    # patch '/nodes/position', params: { nodes: {
    #   0 => { id: @node.id, x: 10, y: 20 },
    #   1 => { id: @task_node.id, x: 11, y: 22 }
    # } }
    # assert_response 200
    # assert_equal 10, @node.reload.x 
    # assert_equal 20, @node.reload.y
    # assert_equal 11, @task_node.reload.x 
    # assert_equal 22, @task_node.reload.y
  end

  test "should return error when node does not belong to user on bulk update" do
    log_in_as(@other_user)
    patch '/nodes/position', params: { nodes: { 0 => { id: @node.id, x: 10, y: 20 } } }
    assert_response 403
  end

  test "should show template node" do
    log_in_as(@other_user)
    get node_path(@template_node)
    data = JSON.parse @response.body.to_str
    assert_equal 'TemplateNode', data['title']
  end

  test "should show public node" do
    log_in_as(@other_user)
    get node_path(@public_node)
    data = JSON.parse @response.body.to_str
    assert_equal 'PublicNode', data['title']
  end
end
