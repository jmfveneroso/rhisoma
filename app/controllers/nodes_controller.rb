class NodesController < ApplicationController
  before_action :logged_in_user
  before_action :correct_user, except: [:create]
  before_action :node_group_belongs_to_user, only: [:create, :update]

  # Creates a new node.
  # @route POST /nodes
  # @route_param node [title]
  # @route_param node [type]
  # @route_param node [node_group_id]
  def create
    unless Node.types.include? params[:node][:type]
      render :status => 400, :json => { code: 400,  
                                        errors: ['Invalid node type']}
      return
    end

    node = params[:node][:type].constantize.new(node_params)
    if node.save
      render :json => node 
    else
      render :status => 400, :json => { code: 400, errors: node.errors }
    end
  end

  # Shows an existing node.
  # @route GET /nodes/$(id)
  def show
    render :json => @node 
  end

  # Updates a node.
  # @route PATCH /nodes
  # @route_param node [title]
  # @route_param node [type]
  def update
    if @node.update_attributes(node_params)
      render :json => @node 
    else
      render :status => 400, :json => { code: 400, errors: @node.errors }
    end
  end

  # Deletes a node.
  # @route DELETE /nodes/$(id)
  def destroy
    if @node.destroy
      render :json => @node 
    else
      render :json => { errors: @node.errors }
    end
  end

  private

    # Allowed node parameters in JSON requests.
    def node_params
      params.require(:node).permit(:title, :type, :node_group_id, :start_date, 
        :end_date, :description, :location, :text, :link, :active, :hidden)
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
      @node = Node.find(params[:id])
      unless current_user?(@node.user)
        render :status => 403, :json => { code: 403, errors: [ {
          message: 'Unauthorized user' 
        } ] }
      end
    end

    # Before filter that confirms the current user has permission to assign
    # a node to the requested node group.
    def node_group_belongs_to_user
      @node_group = NodeGroup.find_by(id: params[:node][:node_group_id])
      unless !@node_group || current_user?(@node_group.user)
        render :status => 403, :json => { code: 403, errors: [ {
          message: 'Unauthorized user' 
        } ] }
      end
    end
end
