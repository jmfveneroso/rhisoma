require 'test_helper'

class UsersLoginTest < ActionDispatch::IntegrationTest
  def setup
    @user = users(:basic_user)
  end

  test "login with invalid information" do
    get root_url
    assert_template 'sessions/new'
    post login_path, params: { session: { email: '', password: '' } }
    assert_template 'sessions/new'
    get root_path
    assert flash.empty?
  end

  test "login with valid information" do
    get root_url
    post login_path, params: { session: { email:    @user.email,
                                          password: 'password' } }

    assert logged_in?
    assert_redirected_to home_path
    follow_redirect!
    assert_template 'users/home'
    assert_select "a[href=?]", logout_path

    delete logout_path 
    assert_not logged_in?
    assert_redirected_to root_url
    follow_redirect!
    assert_select "a[href=?]", logout_path, count: 0

    # Simulate a user clicking logout in a second window.
    delete logout_path
    assert_redirected_to root_url
    follow_redirect!
    assert_select "a[href=?]", logout_path, count: 0
  end

  test "login with remembering" do
    log_in_as(@user, remember_me: '1')
    assert_equal cookies['remember_token'], assigns(:user).remember_token
  end

  test "login without remembering" do
    # Log in to set the cookie.
    log_in_as(@user, remember_me: '1')
    # Log in again and verify that the cookie is deleted.
    log_in_as(@user, remember_me: '0')
    assert_empty cookies['remember_token']
  end
end
