class TerritoriesController < ApplicationController
  before_action :logged_in_user, except: [:show]
  before_action :correct_user, only: [:update, :destroy]
  before_action :correct_user_or_template, only: [:clone]
  before_action :user_has_read_permission, only: [:show]

  # Gets all nodes and edges that belong to a user.
  # @route GET /node-groups
  def index
    @user = current_user
  
    puts 'dadwadwadwwa'

    render :json => {
      territories: @user.territories,
      # The JSON parse is necessary to select the type column.
      nodes: JSON.parse(@user.nodes.select(
        "nodes.id, title, type, territory_id, styling_group_id, x, y, vx, vy, fx, fy, collapse, standby, complete_date"
      ).to_json(only: [
        :id, :title, :type, :territory_id, :styling_group_id, :x, :y, :vx, :vy, :fx, :fy, :collapse, :standby, :complete_date
      ])),
      edges: @user.edges,
      templates: Territory.where(:template => true),
      styling_groups: @user.styling_groups
    }
  end

  # Creates a new node.
  # @route POST /node-groups
  # @route_param node-group [name]
  # @route_param node-group [template]
  def create
    @territory = Territory.new(territory_params)
    @territory.user = current_user 
    if @territory.save
      render :json => @territory
    else
      render :status => 400, :json => { code: 400, errors: @territory.errors }
    end
  end

  # Edits an existing node.
  # @route PATCH /node-groups
  # @route_param node-group [name]
  # @route_param node-group [template]
  def update
    if @territory.update_attributes(territory_params)
      render :json => @territory
    else
      render :status => 400, :json => { code: 400, errors: @territory.errors }
    end
  end

  # Shows the entire graph of a single node group.
  # @route GET /node-groups/$(id)
  def show
    render :json => {
      territory: @territory,
      nodes: JSON.parse(@territory.nodes.select(
        "nodes.id, title, type, territory_id, x, y, vx, vy, fx, fy, collapse, standby, complete_date"
      ).to_json(only: [
        :id, :title, :type, :territory_id, :x, :y, :vx, :vy, :fx, :fy, :collapse, :standby, :complete_date
      ])),
      edges: @territory.edges
    }
  end

  # Deletes a node group.
  # @route DELETE /node-groups/$(id)
  def destroy
    if @territory.destroy
      render :json => @territory
    else
      render :json => { errors: @territory.errors }
    end
  end

  # Clones a node group and all its relations.
  # @route POST /node-groups/$(id)/clone
  def clone
    @new_territory = Territory.new(territory_params)
    @new_territory.user = current_user 
    if !@new_territory.save
      render :json => { errors: @new_territory.errors }
      return
    end

    @territory.clone(@new_territory)
    render :json => @new_territory
  end

  private
  
    # Transforms an attribute into SQL friendly text.
    def sqlize(field)
      text = field
      text = field.getutc if field.is_a? ActiveSupport::TimeWithZone
      field ? ("'#{text}'") : 'NULL'  
    end

    # Allowed node group parameters in JSON requests.
    def territory_params
      if admin?
        params.require(:territory).permit(:name, :public, :template)
      else
        params.require(:territory).permit(:name, :public)
      end
    end

    # Before filter that confirms a logged-in user.
    def logged_in_user
      unless logged_in?
        render :status => 401, :json => { code: 401, errors: [ {
          message: 'Authentication failed' 
        } ] }
      end
    end

    # Before filter that confirms the current user has permission to access the
    # requested territory if it belongs to her or is a template.
    def correct_user_or_template
      @territory = Territory.find(params[:id])
      unless @territory.template || current_user?(@territory.user)
        render :status => 403, :json => { code: 403, errors: [ {
          message: 'Unauthorized user' 
        } ] }
      end
    end

    # Before filter that confirms the current user has permission to alter the
    # requested territory.
    def correct_user
      @territory = Territory.find(params[:id])
      unless current_user?(@territory.user)
        render :status => 403, :json => { code: 403, errors: [ {
          message: 'Unauthorized user' 
        } ] }
      end
    end

    # Before filter that confirms the current user has read permission for the 
    # requested territory. 
    def user_has_read_permission
      @territory = Territory.find(params[:id])
      unless @territory.template || @territory.public || current_user?(@territory.user)
        render :status => 403, :json => { code: 403, errors: [ {
          message: 'Unauthorized user' 
        } ] }
      end
    end
end
