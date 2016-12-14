require 'test_helper'

class UsersControllerTest < ActionDispatch::IntegrationTest
  def setup
    @base_title = "Orkhestra"
  end

  test "should get home" do
    get users_home_url
    assert_response :success
    assert_select "title", "Home | #{@base_title}"
  end

  test "should get territories" do
    get users_territories_url
    assert_response :success
    assert_select "title", "Territories | #{@base_title}"
  end

  test "should get settings" do
    get users_settings_url
    assert_response :success
    assert_select "title", "Settings | #{@base_title}"
  end

  test "should get signup" do
    get signup_path
    assert_response :success
  end

end
