require 'test_helper'

class NodeGroupsControllerTest < ActionDispatch::IntegrationTest
  def setup
    @node_group = node_groups(:one)
    @public_node_group = node_groups(:two)
    @node       = nodes(:node_one)
    @task_node = nodes(:node_two)
    @user       = users(:basic_user)
    @other_user = users(:second_user)
  end

  test "should return error when user not logged in" do
    get node_groups_path
    assert_response 401

    post node_groups_path, params: { node_group: { name: 'abc' } }
    assert_response 401

    get node_group_path(@node_group)
    assert_response 401

    patch node_group_path(@node_group), params: { node_group: { name: 'abc' } }
    assert_response 401

    delete node_group_path(@node_group)
    assert_response 401

    post "/node_groups/#{@node_group.id}/clone", params: { node_group: { name: 'NG' } }
    assert_response 401
  end

  test "should return error when user does not have permission" do
    log_in_as(@other_user)
    get node_group_path(@node_group)
    assert_response 403

    patch node_group_path(@node_group), params: { node_group: { title: 'abc' } }
    assert_response 403

    delete node_group_path(@node_group)
    assert_response 403

    post "/node_groups/#{@node_group.id}/clone", params: { node_group: { name: 'NG' } }
    assert_response 403
  end

  test "should show all node groups for the current user" do
    log_in_as(@user)
    get node_groups_path
    assert_response 200
    data = JSON.parse @response.body

    assert_equal 2, data['node_groups'].count
    assert_equal 3, data['nodes'].count
    assert_equal 1, data['edges'].count
    assert_equal 1, data['templates'].count
  end

  test "should create node group for current user" do
    log_in_as(@user)
    assert_difference '@user.node_groups.count', 1 do
      post node_groups_path, params: { node_group: { name: 'abc' } }
      assert_response 200
    end
  end

  test "should show private node group" do
    log_in_as(@user)
    get node_group_path(@node_group)
    assert_response 200

    data = JSON.parse @response.body
    assert_equal 'The Node Group', data['node_group']['name']
    assert_equal 3, data['nodes'].count
    assert_equal 1, data['edges'].count
  end

  test "should show public node group" do
    log_in_as(@other_user)
    get node_group_path(@public_node_group)
    assert_response 200

    data = JSON.parse @response.body
    assert_equal 'The Public Node Group', data['node_group']['name']
  end

  test "should not update node group if missing key parameters" do
    log_in_as(@user)
    old_name = @node_group.name
    patch node_group_path(@node_group), params: { node_group: { name: '' } }
    assert_response 400
    assert_equal old_name, @node_group.reload.name
  end

  test "should update node group" do
    log_in_as(@user)
    old_name = @node_group.name
    patch node_group_path(@node_group), params: { node_group: { name: 'New Name' } }
    assert_response 200
    assert_not_equal old_name, @node_group.reload.name
  end

  test "should destroy node group" do
    log_in_as(@user)
    delete node_group_path(@node_group)
    assert_response 200
    assert NodeGroup.where(id: @node_group.id).empty?
  end

  test "should clone node group" do
    log_in_as(@user)

    assert_difference 'NodeGroup.count', 1 do
      post "/node_groups/#{@node_group.id}/clone", params: { node_group: { name: 'NG' } }
    end

    id = JSON.parse(@response.body)['id']
    ng = NodeGroup.find id

    assert_equal 'NG', ng['name']
    assert_equal 3, ng.nodes.count
    assert_equal 1, ng.edges.count
  end

  test "should clone public node group" do
    log_in_as(@other_user)

    assert_difference 'NodeGroup.count', 1 do
      post "/node_groups/#{@public_node_group.id}/clone", params: { node_group: { name: 'NG' } }
    end
  end
end
