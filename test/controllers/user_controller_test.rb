require 'test_helper'

class UserControllerTest < ActionDispatch::IntegrationTest
  def setup
    @base_title = "Orkhestra"
  end

  test "should get home" do
    get user_home_url
    assert_response :success
    assert_select "title", "Home | #{@base_title}"
  end

  test "should get territories" do
    get user_territories_url
    assert_response :success
    assert_select "title", "Territories | #{@base_title}"
  end

  test "should get settings" do
    get user_settings_url
    assert_response :success
    assert_select "title", "Settings | #{@base_title}"
  end

end
