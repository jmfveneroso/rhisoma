require 'test_helper'

class TerritoriesControllerTest < ActionDispatch::IntegrationTest
  def setup
    @territory        = territories(:one)
    @public_territory = territories(:two)
    @node             = nodes(:node_one)
    @task_node        = nodes(:node_two)
    @user             = users(:basic_user)
    @other_user       = users(:second_user)
  end

  test "should return error when user not logged in" do
    get territories_path
    assert_response 401

    post territories_path, params: { territory: { name: 'abc' } }
    assert_response 401

    get territory_path(@territory)
    assert_response 401

    patch territory_path(@territory), params: { territory: { name: 'abc' } }
    assert_response 401

    delete territory_path(@territory)
    assert_response 401

    post "/territories/#{@territory.id}/clone", params: { territory: { name: 'NG' } }
    assert_response 401
  end

  test "should return error when user does not have permission" do
    log_in_as(@other_user)
    get territory_path(@territory)
    assert_response 403

    patch territory_path(@territory), params: { territory: { title: 'abc' } }
    assert_response 403

    delete territory_path(@territory)
    assert_response 403

    post "/territories/#{@territory.id}/clone", params: { territory: { name: 'NG' } }
    assert_response 403
  end

  test "should show all territories for the current user" do
    log_in_as(@user)
    get territories_path
    assert_response 200
    data = JSON.parse @response.body

    assert_equal 2, data['territories'].count
    assert_equal 3, data['nodes'].count
    assert_equal 1, data['edges'].count
    assert_equal 1, data['templates'].count
  end

  test "should create territory for current user" do
    log_in_as(@user)
    assert_difference '@user.territories.count', 1 do
      post territories_path, params: { territory: { name: 'abc' } }
      assert_response 200
    end
  end

  test "should show private territory" do
    log_in_as(@user)
    get territory_path(@territory)
    assert_response 200

    data = JSON.parse @response.body
    assert_equal 'The Territory', data['territory']['name']
    assert_equal 3, data['nodes'].count
    assert_equal 1, data['edges'].count
  end

  test "should show public territory" do
    log_in_as(@other_user)
    get territory_path(@public_territory)
    assert_response 200

    data = JSON.parse @response.body
    assert_equal 'The Public Territory', data['territory']['name']
  end

  test "should not update territory if missing key parameters" do
    log_in_as(@user)
    old_name = @territory.name
    patch territory_path(@territory), params: { territory: { name: '' } }
    assert_response 400
    assert_equal old_name, @territory.reload.name
  end

  test "should update territory" do
    log_in_as(@user)
    old_name = @territory.name
    patch territory_path(@territory), params: { territory: { name: 'New Name' } }
    assert_response 200
    assert_not_equal old_name, @territory.reload.name
  end

  test "should destroy territory" do
    log_in_as(@user)
    delete territory_path(@territory)
    assert_response 200
    assert Territory.where(id: @territory.id).empty?
  end

  test "should clone territory" do
    log_in_as(@user)

    assert_difference 'Territory.count', 1 do
      post "/territories/#{@territory.id}/clone", params: { territory: { name: 'NG' } }
    end

    id = JSON.parse(@response.body)['id']
    ng = Territory.find id

    assert_equal 'NG', ng['name']
    assert_equal 3, ng.nodes.count
    assert_equal 1, ng.edges.count
  end

  test "should clone public territory" do
    log_in_as(@other_user)

    assert_difference 'Territory.count', 1 do
      post "/territories/#{@public_territory.id}/clone", params: { territory: { name: 'NG' } }
    end
  end
end
