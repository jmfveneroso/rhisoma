# The password resets controller handles password reset logic that happens
# after the user clicks "Forgot password?".
# 
# @author João Mateus de Freitas Veneroso
# @since 0.1.0
class PasswordResetsController < ApplicationController
  before_action :get_user,   only: [:edit, :update]
  before_action :valid_user, only: [:edit, :update]
  before_action :check_expiration, only: [:edit, :update]

  # Renders "Forgot password?" view.
  # @route GET /password_resets/new
  def new
  end

  # Creates a new password reset request and sends an email to the user
  # requiring confirmation.
  # @route POST /password_resets
  # @route_param password_reset [email]
  def create
    @user = User.find_by(email: params[:password_reset][:email].downcase)
    if @user
      @user.create_reset_digest
      @user.send_password_reset_email
      flash[:info] = "Email sent with password reset instructions"
      redirect_to root_url
    else
      flash.now[:danger] = "Email address not found"
      render 'new'
    end
  end

  # Renders the password reset confirmation view. The user email is stored
  # in the view as a hidden input field so we can known which user requested
  # the password reset at the update stage.
  # @route GET /password_resets/$(password_reset_token)/edit
  # @route_param email
  def edit
  end

  # Confirms the password reset.
  # @route PATCH /password_resets/$(password_reset_token)
  # @route_param user [email]
  # @route_param user [password]
  def update
    if params[:user][:password].empty?
      @user.errors.add(:password, "can't be empty")
      render 'edit'
    elsif @user.update_attributes(user_params)
      log_in @user
      @user.update_attribute(:reset_digest, nil)
      flash[:success] = "Password has been reset."
      redirect_to @user
    else
      render 'edit'
    end
  end

  private

    # Required fields in the update route.
    def user_params
      params.require(:user).permit(:password, :password_confirmation)
    end

    # Before filter that selects user by email.
    def get_user
      @user = User.find_by(email: params[:email])
    end

    # Before filter that confirms a valid user.
    def valid_user
      unless (@user && @user.activated? &&
              @user.authenticated?(:reset, params[:id]))
        redirect_to root_url
      end
    end

    # Before filter that checks the expiration date of the reset token.
    def check_expiration
      if @user.password_reset_expired?
        flash[:danger] = "Password reset has expired."
        redirect_to new_password_reset_url
      end
    end
end
