class StylingGroupsController < ApplicationController
  before_action :logged_in_user, only: [:create]
  before_action :correct_user, except: [:show, :create]

  # Creates a new styling group.
  # @route POST /styling_groups
  # @route_param styling_group [name]
  # @route_param styling_group [color]
  def create
    @styling_group = StylingGroup.new(styling_group_params)
    @styling_group.user = current_user 
    if @styling_group.save
      render :json => @styling_group
    else
      render :status => 400, :json => { code: 400, errors: @styling_group.errors }
    end
  end

  # Shows an existing styling group.
  # @route GET /styling-groups/$(id)
  def show
    @styling_group = StylingGroup.find(params[:id])
    render :json => @styling_group
  end

  # Updates a styling group.
  # @route PATCH /styling-groups/$(id)
  # @route_param styling_group [color]
  def update
    if @styling_group.update_attributes(styling_group_params)
      render :json => @styling_group
    else
      render :status => 400, :json => { code: 400, errors: @styling_group.errors }
    end
  end

  # Deletes a styling group.
  # @route DELETE /nodes/$(id)
  def destroy
    if @styling_group.destroy
      render :json => @styling_group
    else
      render :json => { errors: @styling_group.errors }
    end
  end

  private

    # Allowed styling group parameters in JSON requests.
    def styling_group_params
      params.require(:styling_group).permit(:name, :color)
    end

    # Before filter that confirms a logged-in user.
    def logged_in_user
      unless logged_in?
        render :status => 401, :json => { code: 401, errors: [ {
          message: 'Authentication failed' 
        } ] }
      end
    end

    # Before filter that confirms the current user has permission to read the
    # requested styling group. 
    def correct_user
      @styling_group = StylingGroup.find(params[:id])
      unless current_user?(@styling_group.user)
        render :status => 403, :json => { code: 403, errors: [ {
          message: 'Unauthorized user' 
        } ] }
      end
    end
end
