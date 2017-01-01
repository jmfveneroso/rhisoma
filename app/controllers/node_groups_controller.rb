class NodeGroupsController < ApplicationController
  before_action :logged_in_user
  before_action :correct_user, only: [:update, :destroy]
  before_action :correct_user_or_public, only: [:show]

  # Gets all nodes and edges that belong to a user.
  # @route GET /node-groups
  def index
    @user = current_user
    render :json => {
      node_groups: @user.node_groups,
      nodes: @user.nodes,
      edges: @user.edges,
      templates: NodeGroup.where(:public => true)
    }
  end

  # Creates a new node.
  # @route POST /node-groups
  # @route_param node-group [name]
  # @route_param node-group [public]
  def create
    @node_group = NodeGroup.new(node_group_params)
    @node_group.user = current_user 
    if @node_group.save
      render :json => @node_group
    else
      render :status => 400, :json => { code: 400, errors: @node_group.errors }
    end
  end

  # Edits an existing node.
  # @route PATCH /node-groups
  # @route_param node-group [name]
  # @route_param node-group [public]
  def update
    if @node_group.update_attributes(node_group_params)
      render :json => @node_group
    else
      render :status => 400, :json => { code: 400, errors: @node_group.errors }
    end
  end

  # Shows the entire graph of a single node group.
  # @route GET /node-groups/$(id)
  def show
    render :json => {
      node_group: @node_group,
      nodes: @node_group.nodes,
      edges: @node_group.edges
    }
  end

  # Deletes a node group.
  # @route DELETE /node-groups/$(id)
  def destroy
    if @node_group.destroy
      render :json => @node_group
    else
      render :json => { errors: @node_group.errors }
    end
  end

  private

    # Allowed node group parameters in JSON requests.
    def node_group_params
      if admin?
        params.require(:node_group).permit(:name, :public)
      else
        params.require(:node_group).permit(:name)
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
    # requested node_group if it belongs to her or it is public.
    def correct_user_or_public
      @node_group = NodeGroup.find(params[:id])
      unless @node_group.public || current_user?(@node_group.user)
        render :status => 403, :json => { code: 403, errors: [ {
          message: 'Unauthorized user' 
        } ] }
      end
    end

    # Before filter that confirms the current user has permission to alter the
    # requested node group.
    def correct_user
      @node_group = NodeGroup.find(params[:id])
      unless current_user?(@node_group.user)
        render :status => 403, :json => { code: 403, errors: [ {
          message: 'Unauthorized user' 
        } ] }
      end
    end
end
