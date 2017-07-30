class TerritoriesController < ApplicationController
  before_action :logged_in_user, except: [:show]
  before_action :correct_user, only: [:update, :destroy]
  before_action :correct_user_or_template, only: [:clone]
  before_action :user_has_read_permission, only: [:show]

  # Shows the territory creation form.
  # @route GET /territories/new
  def new
    @user = current_user
    @territory = Territory.new
  end

  # Gets all nodes and edges that belong to a user.
  # @route GET /territories
  def index
    @user = current_user
  
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
  # @route POST /territories
  # @route_param territory [name]
  # @route_param territory [template]
  def create
    @territory = Territory.new(territory_params)
    @territory.user = current_user 

    respond_to do |format|
      format.html {
        if @territory.save
          flash[:success] = t :territory_created
        else
          flash[:error] = @territory.errors
        end
        redirect_to '/settings/rhisomas'
      }
      format.json { 
        if @territory.save
          render :json => @territory
        else
          render :status => 400, :json => { code: 400, errors: @territory.errors }
        end
      }
    end
  end

  # Edits an existing node.
  # @route PATCH /territories
  # @route_param territory [name]
  # @route_param territory [template]
  def update
    respond_to do |format|
      format.html {
        if @territory.update_attributes(territory_params)
          flash[:success] = t :territory_updated
        else
          flash[:error] = @territory.errors
        end
        redirect_to '/settings/rhisomas'
      }
      format.json { 
        if @territory.update_attributes(territory_params)
          render :json => @territory
        else
          render :status => 400, :json => { code: 400, errors: @territory.errors }
        end
      }
    end
  end

  # Shows the entire graph of a single node group.
  # @route GET /territories/$(id)
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
  # @route DELETE /territories/$(id)
  def destroy
    respond_to do |format|
      format.html {
        if @territory.destroy
          flash[:success] = t :territory_destroyed
        else
          flash[:error] = @territory.errors
        end
        redirect_to '/settings/rhisomas'
      }
      format.json { 
        if @territory.destroy
          render :json => @territory
        else
          render :json => { errors: @territory.errors }
        end
      }
    end
  end

  # Clones a node group and all its relations.
  # @route POST /territories/$(id)/clone
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

  def list 
    @user = current_user
  end

  def edit
    @user = current_user
    @territory = @user.territories.find(params.require(:id))
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
        params.require(:territory).permit(:name, :public, :main, :template)
      else
        params.require(:territory).permit(:name, :public, :main)
      end
    end

    # Before filter that confirms a logged-in user.
    def logged_in_user
      unless logged_in?
        render :status => 401, :json => { code: 401, errors: [ {
          message: t(:auth_failed)
        } ] }
      end
    end

    # Before filter that confirms the current user has permission to access the
    # requested territory if it belongs to her or is a template.
    def correct_user_or_template
      @territory = Territory.find(params[:id])
      unless @territory.template || current_user?(@territory.user)
        render :status => 403, :json => { code: 403, errors: [ {
          message: t(:unauthorized_user)
        } ] }
      end
    end

    # Before filter that confirms the current user has permission to alter the
    # requested territory.
    def correct_user
      @territory = Territory.find(params[:id])
      unless current_user?(@territory.user)
        render :status => 403, :json => { code: 403, errors: [ {
          message: t(:unauthorized_user)
        } ] }
      end
    end

    # Before filter that confirms the current user has read permission for the 
    # requested territory. 
    def user_has_read_permission
      @territory = Territory.find(params[:id])
      unless @territory.template || @territory.public || current_user?(@territory.user)
        render :status => 403, :json => { code: 403, errors: [ {
          message: t(:unauthorized_user)
        } ] }
      end
    end
end
