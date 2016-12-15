module SessionsHelper
  # Logs the user in.
  def log_in(user)
    session[:user_id] = user.id
  end

  # Logs the user out.
  def log_out
    session.delete(:user_id)
    @current_user = nil
  end

  # Returns the current logged-in user, if any.
  def current_user
    @current_user ||= User.find_by(id: session[:user_id])
  end

  def logged_in?
    !current_user.nil?
  end
end
