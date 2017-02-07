require 'test_helper'

class UsersControllerTest < ActionDispatch::IntegrationTest
  def setup
    @base_title = "Orkhestra"
    @user       = users(:basic_user)
    @other_user = users(:second_user)
  end

  test "should get signup" do
    get signup_path
    assert_response :success
  end

  test "should redirect update when not logged in" do
    patch user_path(@user), params: { user: { email: @user.email } }
    assert_not flash.empty?
    assert_redirected_to login_url
  end

  test "should redirect update when logged in as wrong user" do
    log_in_as(@other_user)
    patch user_path(@user), params: { user: { email: @user.email } }
    assert flash.empty?
    assert_redirected_to root_url
  end

  test "should redirect index when not logged in" do
    get users_path
    assert_redirected_to login_url
  end

  test "should not allow the admin attribute to be edited via the web" do
    log_in_as(@other_user)
    assert_not @other_user.admin?
    patch user_path(@other_user), params: {
                                    user: { password:              'password',
                                            password_confirmation: 'password',
                                            admin: '1' } }
    assert_not @other_user.admin?
  end

  test "should redirect destroy when not logged in" do
    assert_no_difference 'User.count' do
      delete user_path(@user)
    end
    assert_redirected_to login_url
  end

  test "should redirect destroy when logged in as a non-admin" do
    log_in_as(@other_user)
    assert_no_difference 'User.count' do
      delete user_path(@user)
    end
    assert_redirected_to root_url
  end

  test "should not update password when old password is wrong" do
    log_in_as(@user)
    old_digest = @user.password_digest
    post change_password_path, params: {
                        user: { old_password:          'wrong',
                                password:              'newpassword',
                                password_confirmation: 'newpassword' } }
    assert_equal old_digest, @user.reload.password_digest
  end

  test "should update password when old password is correct" do
    log_in_as(@user)
    old_digest = @user.password_digest
    post change_password_path, params: {
                        user: { old_password:          'password',
                                password:              'newpassword',
                                password_confirmation: 'newpassword' } }
    @user.reload
    assert_not_equal old_digest, @user.password_digest
  end

  test "should redirect profile when not logged in" do
    get profile_path
    assert_redirected_to login_url
  end

  test "should get profile when logged in" do
    log_in_as(@user)
    get profile_path
    assert_template 'users/profile'
  end

  test "should redirect account when not logged in" do
    get account_path
    assert_redirected_to login_url
  end

  test "should get account when logged in" do
    log_in_as(@user)
    get account_path
    assert_template 'users/account'
  end

  test "should get confirm delete account when not logged in" do
    get confirm_delete_account_path
    assert_redirected_to login_url
  end

  test "should get confirm delete account when logged in" do
    log_in_as(@user)
    get confirm_delete_account_path
    assert_template 'users/confirm_delete_account'
  end

  test "should not destroy account when password is wrong" do
    log_in_as(@user)
    post delete_account_path, params: { user: { password: 'wrongpassword' } }
    assert flash.empty?
    assert_template 'users/confirm_delete_account'
  end

  test "should destroy account when password is correct" do
    log_in_as(@user)
    post delete_account_path, params: { user: { password: 'password' } }
    assert User.where(id: @user.id).empty?
    assert_not flash.empty?
    assert_redirected_to root_url
  end
end
