require 'test_helper'

class StylingGroupsControllerTest < ActionDispatch::IntegrationTest
  def setup
    @sg         = styling_groups(:one)
    @user       = users(:basic_user)
    @other_user = users(:second_user)
  end

  test "should return error when user not logged in" do
    post styling_groups_path, params: { styling_group: { name: 'x' } }
    assert_response 401
  end

  test "should return error when user does not have permission" do
    log_in_as(@other_user)
    patch styling_group_path(@sg), params: { styling_group: { name: 'x' } }
    assert_response 403

    delete styling_group_path(@sg)
    assert_response 403
  end

  test "should show styling group" do
    get styling_group_path(@sg)
    assert_response 200

    data = JSON.parse @response.body
    assert_equal 'MyGroup', data['name']
  end

  test "should update styling group" do
    log_in_as(@user)
    old_name = @sg.name
    patch styling_group_path(@sg), params: { styling_group: { name: 'x' } }
    assert_not_equal old_name, @sg.reload.name
  end

  test "should delete styling group" do
    log_in_as(@user)
    delete styling_group_path(@sg)
    assert StylingGroup.where(id: @sg.id).empty?
  end
end
