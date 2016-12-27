require 'test_helper'

class UsersEditTest < ActionDispatch::IntegrationTest
  def setup
    @user = users(:basic_user)
  end

  test "unsuccessful edit" do
    log_in_as(@user)
    patch user_path(@user), params: { user: { email: "foo@invalid",
                                              password:              "foo",
                                              password_confirmation: "bar" } }

    assert_template 'users/profile'
  end

  test "successful edit" do
    log_in_as(@user)

    email = "foo@bar.com"
    patch user_path(@user), params: { user: { email: email,
                                              password:              "",
                                              password_confirmation: "" } }
    assert_not flash.empty?
    assert_redirected_to profile_path
    @user.reload
    assert_equal email, @user.email
  end
end
