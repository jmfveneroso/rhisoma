# The user controller handles user creation logic and user settings
# management.
# 
# @author João Mateus de Freitas Veneroso
# @since 0.1.0
class UsersController < ApplicationController
  before_action :logged_in_user, except: [:new, :create]
  before_action :correct_user,   only:   [:edit, :update]
  before_action :admin_user,     only:   [:index, :show, :destroy]
 
  # Renders all users in a paginated list. This route is only accessible
  # by the site admin.
  # @route GET /users
  def index
    @users = User.paginate(page: params[:page])
  end

  # Renders the user creation view.
  # @route GET /users/new
  def new
    @user = User.new
  end

  # Not used yet.
  # @route GET /users/show/$(id)
  def show
    @user = User.find(params[:id])
  end

  # Creates a new user and sends an activation email.
  # @route POST /users
  # @route_param user [email]
  # @route_param user [password]
  # @route_param user [password_confirmation]
  def create
    @user = User.new(user_params)
    if @user.save
      @user.send_activation_email
      flash[:info] = "Please check your email to activate your account."
      redirect_to root_url
    else
      render 'new'
    end
  end

  # Updated user information.
  # @route PATCH /users/$(id)
  # @route_param user [name]
  def update
    @user = User.find(params[:id])
    if @user.update_attributes(user_params)
      flash[:success] = "Profile updated"
      redirect_to profile_path
    else
      render 'users/profile'
    end
  end

  # Destroys a user. This route is only accessible by the site admin.
  # @route DELETE /users/$(id)
  def destroy
    User.find(params[:id]).destroy
    flash[:success] = "User deleted"
    redirect_to users_url
  end

  # Renders the graph if the user is logged in.
  # @route GET /home
  def home
    @user = current_user
  end

  # Settings.

  # Renders the profile settings if the user is logged in.
  # @route GET /settings/profile
  def profile
    @user = current_user
  end

  # Renders the account settings if the user is logged in.
  # @route GET /settings/account
  def account
    @user = current_user
  end

  # Changes the current user's password if the old password is correct.
  # The password is requested to prevent password changes if the
  # user session is hijacked.
  # @route POST /settings/change_password
  # @route_param user [old_password]
  # @route_param user [password]
  # @route_param user [password_confirmation]
  def change_password
    @user = current_user
    if @user.authenticated?(:password, params[:user][:old_password])
      if @user.update_attributes(user_params)
        if params[:user][:password].empty?
          @user.errors.add(:base, 'Password can\'t be blank.')
        else
          flash.now[:success] = "Profile updated"
        end
      end
    else
      @user.errors.add(:base, 'Wrong password')
    end
    render 'account'
  end

  # Renders the delete account confirmation view.
  # @route GET /settings/confirm_delete_account
  def confirm_delete_account
    @user = current_user
  end

  # Deletes the current user's account if the password is correct.
  # The password is requested to prevent acount deletion if the
  # user session is hijacked.
  # @route POST /settings/delete_account
  # @route_param user [password]
  def delete_account
    @user = current_user
    if @user.authenticated?(:password, params[:user][:password])
      log_out if logged_in?
      @user.destroy
      flash[:success] = "Account deleted"
      redirect_to root_url
    else
      @user.errors.add(:base, 'Wrong password')
      render 'confirm_delete_account'
    end
  end

  private

    # Allowed update user parameters.
    def user_params
      params.require(:user).permit(:name, :email, :password, :password_confirmation)
    end

    # Before filter that confirms a logged-in user.
    def logged_in_user
      unless logged_in?
        store_location
        flash[:danger] = "Please log in"
        redirect_to login_url
      end
    end

    # Before filter that confirms the current user has permission to alter the
    # requested user.
    def correct_user
      @user = User.find(params[:id])
      redirect_to(root_url) unless current_user?(@user)
    end

    # Before filter that confirms a site admin user.
    def admin_user
      redirect_to(root_url) unless current_user.admin?
    end
end
