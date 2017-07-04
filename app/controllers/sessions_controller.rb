# The sessions controller handles authentication logic in persistent and
# non persistent sessions.
# 
# @author João Mateus de Freitas Veneroso
# @since 0.1.0
class SessionsController < ApplicationController
  # Renders the sign in page. It is the root url.
  # @route GET /
  def new
    if logged_in?
      redirect_to home_url and return
    end
  end

  # Authenticates the user by checking the email and password. If the
  # "remember me" option is selected, the session key is stored in a 
  # persistent cookie.
  # @route POST /sessions
  # @route_param session [email]
  # @route_param session [password]
  # @route_param session [remember_me]
  def create
    @user = User.find_by(email: params[:session][:email].downcase)
    if @user && @user.authenticate(params[:session][:password])
      if @user.activated?
        log_in @user
        params[:session][:remember_me] == '1' ? remember(@user) : forget(@user)
        redirect_back_or home_path
      else
        message  = "Account not activated. "
        message += "Check your email for the activation link."
        flash[:warning] = message
        redirect_to root_url
      end
    else 
      flash.now[:danger] = 'Invalid email/password combination'
      render 'new'
    end
  end

  # Logs the user out.
  # @route DELETE /logout
  def destroy
    log_out if logged_in?
    redirect_to root_url
  end

  # Logs the user out without the verb delete.
  # @route GET /logout
  def fake_destroy
    log_out if logged_in?
    redirect_to root_url
  end

  def temp
    render text: "xRopmvAAYIk8wjXUJj1ASeJps3MWPADlcyX3G7tF5uc.ffInSMDcCzzBOEdK0yJF1Cidw86HhIcw2cktXgSgsY8"
  end
end
