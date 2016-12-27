class NodesController < ApplicationController
  before_action :logged_in_user
  before_action :correct_user, except: [:create, :graph]

  # Creates a new node.
  # @route POST /nodes
  # @route_param node [title]
  # @route_param node [type]
  def create
    node = Node.new(node_params)
    node.user = current_user
    if node.save
      render :json => node 
    else
      render :status => 400, :json => { code: 400, errors: node.errors }
    end
  end

  # Updates a new node.
  # @route PATCH /nodes
  # @route_param node [title]
  # @route_param node [type]
  def update
    node = Node.find(params[:id])
    if node.update_attributes(node_params)
      render :json => node 
    else
      render :status => 400, :json => { code: 400, errors: node.errors }
    end
  end

  # Deletes a node.
  # @route DELETE /nodes/$(id)
  def destroy
    node = Node.find(params[:id])
    if node.destroy
      render :json => node 
    else
      render :json => { errors: node.errors }
    end
  end

  # Creates a new edge connecting two nodes.
  # @route POST /nodes/$(id)/connect
  # @route_param edge [target_id]
  def connect
    node = Node.find(params[:id])
    if edge = node.edges.create(target_id: params[:edge][:target_id])
      render :json => edge
    else
      render :json => { errors: edge.errors }
    end
  end

  # Updates an edge.
  # @route DELETE /nodes/$(id)/disconnect
  # @route_param edge [target_id]
  def disconnect
    node = Node.find(params[:id])
    node.edges.where(target_id: params[:edge][:target_id]).destroy_all
    render :json => { status: 'success' }
  end

  # Gets a user graph in the timestamp range specified or
  # all nodes if no timestamp is specified.
  # @route PATCH /nodes/edge/$(id)
  # @route_param edge [category]
  def graph
    render :json => current_user.graph
  end

  private

    # Allowed node params.
    def node_params
      params.require(:node).permit(:title, :type, :active, :hidden)
    end

    # Before filter that confirms a logged-in user.
    def logged_in_user
      unless logged_in?
        render :status => 401, :json => { code: 401, errors: [ {
          message: 'Authentication failed' 
        } ] }
      end
    end

    # Before filter that confirms the current user has permission to alter the
    # requested node.
    def correct_user
      node = Node.find(params[:id])
      unless current_user?(node.user)
        render :status => 403, :json => { code: 403, errors: [ {
          message: 'Unauthorized user' 
        } ] }
      end
    end
end
