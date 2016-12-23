require 'test_helper'

class EmailResetsTest < ActionDispatch::IntegrationTest
  def setup
    ActionMailer::Base.deliveries.clear
    @user = users(:basic_user)
  end

  test "email resets" do
    # ===New email reset===
    log_in_as(@user)
    get new_email_reset_path
    assert_template 'email_resets/new'

    # Invalid email
    post email_resets_path, params: { email_reset: { new_email: @user.email } }
    user = assigns(:user)
    assert_not user.valid?
    assert_template 'email_resets/new'

    # Valid email
    post email_resets_path, params: { email_reset: { new_email: 'test@email.com' } }
    assert_not_equal @user.email_reset_digest, @user.reload.email_reset_digest
    assert_equal 'test@email.com', @user.new_email
    assert_equal 1, ActionMailer::Base.deliveries.size
    assert_not flash.empty?
    assert_redirected_to account_path

    # ===Edit email reset===
    user = assigns(:user)

    # Wrong email
    get edit_email_reset_path(user.email_reset_token, email: "")
    assert_redirected_to root_url

    # Inactive user
    user.toggle!(:activated)
    get edit_email_reset_path(user.email_reset_token, email: user.email)
    assert_redirected_to root_url
    user.toggle!(:activated)

    # Right email, wrong token
    get edit_email_reset_path('wrong token', email: user.email)
    assert_redirected_to root_url

    # Right email, right token
    get edit_email_reset_path(user.email_reset_token, email: user.email)
    assert_template 'email_resets/edit'

    # Invalid password
    patch email_reset_path(user.email_reset_token),
          params: { email: user.email, user: { password: "wrongpassword" } }
    assert_select 'div.errors-panel'

    # Valid password
    patch email_reset_path(user.email_reset_token),
          params: { email: user.email, user: { password: "password" } }

    @user.reload
    assert_nil @user.email_reset_digest
    assert_equal 'test@email.com', @user.email
    assert logged_in?
    assert_not flash.empty?
    assert_redirected_to home_path
  end

  test "expired token" do
    log_in_as(@user)
    get new_email_reset_path
    post email_resets_path,
         params: { email_reset: { new_email: 'new_email@example.com' } }

    @user = assigns(:user)
    @user.update_attribute(:email_reset_sent_at, 3.hours.ago)

    patch email_reset_path(@user.email_reset_token),
          params: { email: @user.email,
                    user: { password:              "foobar",
                            password_confirmation: "foobar" } }
    assert_response :redirect
    follow_redirect!
    assert_match /Email reset has expired/i, response.body
  end
end
