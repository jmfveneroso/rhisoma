class EdgesController < ApplicationController
  before_action :logged_in_user, except: [:show]
  before_action :correct_user, except: [:create, :show]
  before_action :nodes_belong_to_user, only: [:create, :update]
  before_action :user_has_read_permission, only: [:show]

  # Creates a new edge.
  # @route POST /edges
  # @route_param edge [category]
  # @route_param edge [source_id]
  # @route_param edge [target_id]
  def create
    edge = Edge.new(edge_params)
    if edge.save
      render :json => edge
    else
      render :status => 400, :json => { code: 400, errors: edge.errors }
    end
  end

  # Shows an existing edge.
  # @route GET /edges/$(id)
  def show
    render :json => @edge
  end

  # Updates an edge.
  # @route PATCH /edges
  # @route_param edge [category]
  # @route_param edge [source_id]
  # @route_param edge [target_id]
  def update
    if @edge.update_attributes(edge_params)
      render :json => @edge 
    else
      render :status => 400, :json => { code: 400, errors: @edge.errors }
    end
  end

  # Deletes an edge.
  # @route DELETE /edges/$(id)
  def destroy
    if @edge.destroy
      render :json => @edge
    else
      render :json => { errors: @edge.errors }
    end
  end

  private

    # Allowed edge parameters in JSON requests.
    def edge_params
      params.require(:edge).permit(:category, :source_id, :target_id)
    end

    # Before filter that confirms a logged-in user.
    def logged_in_user
      unless logged_in?
        render :status => 401, :json => { code: 401, errors: [ {
          message: t(:auth_failed)
        } ] }
      end
    end

    # Before filter that confirms the current user has permission to alter the
    # requested edge.
    def correct_user
      @edge = Edge.find(params[:id])
      unless current_user?(@edge.user)
        render :status => 403, :json => { code: 403, errors: [ {
          message: t(:unauthorized_user)
        } ] }
      end
    end

    # Before filter that confirms the current user has permission to assign
    # a connection between the given nodes.
    def nodes_belong_to_user
      @source_node = Node.find_by(id: params[:edge][:source_id])
      @target_node = Node.find_by(id: params[:edge][:target_id])
      unless (!@source_node || current_user?(@source_node.user)) &&
             (!@target_node || current_user?(@target_node.user))
        render :status => 403, :json => { code: 403, errors: [ {
          message: t(:unauthorized_user)
        } ] }
      end
    end

    def user_has_read_permission
      @edge = Edge.find(params[:id])
      public_source = @edge.source.territory.public || @edge.source.territory.template
      public_target = @edge.target.territory.public || @edge.target.territory.template
      unless current_user?(@edge.user) || (public_source && public_target)
        render :status => 403, :json => { code: 403, errors: [ {
          message: t(:unauthorized_user)
        } ] }
      end
    end
end
