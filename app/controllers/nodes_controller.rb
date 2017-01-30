class NodesController < ApplicationController
  before_action :logged_in_user
  before_action :correct_user, only: [:show, :update, :destroy]
  before_action :node_group_belongs_to_user, only: [:create, :update]
  before_action :all_nodes_belong_to_user, only: [:bulk_update_pos]

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
    attributes = [:id, :title, :x, :y, :vx, :vy, 
                  :fx, :fy, :type, :node_group_id]
    case @node.type
      when 'CategoryNode' 
        attributes.concat([:description])
      when 'TaskNode' 
        attributes.concat([:description, :start_date, :end_date])
      when 'TextNode' 
        attributes.concat([:text])
      when 'LinkNode' 
        attributes.concat([:link])
    end

    # The JSON parse is necessary to select the type column.
    render :json => JSON.parse(@node.to_json(only: attributes))
  end

  # Updates a node.
  # @route PATCH /nodes/$(id)
  # @route_param node [title]
  # @route_param node [type]
  def update
    @node.assign_attributes(node_params)
    @node = @node.becomes(@node.type.constantize)
    @node.erase_type_attributes
    if @node.save
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

  # Updates the position of multiple nodes.
  # @route PATCH /nodes/pos
  def bulk_update_pos
    Node.bulk_update_pos(@nodes.to_json)
    render :json => 'success'
  end

  private

    # Allowed node parameters in JSON requests.
    def node_params
      params.require(:node).permit(:title, :type, :node_group_id, :start_date, 
        :end_date, :description, :text, :link, :active, :hidden, :x, :y, :vx, 
        :vy, :fx, :fy)
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

    # Before filter that confirms all nodes referenced in the request belong
    # to the current user.
    def all_nodes_belong_to_user
      @nodes = params.require(:nodes).permit!

      # Convert to array.
      @nodes = @nodes.to_h().map { |key, value| value } 

      # Check if all nodes belong to user.
      ids = @nodes.map do |n| n['id'] end
      if current_user.nodes.where("nodes.id IN (#{ids.join(',')})").count !=
        @nodes.count
        render :status => 403, :json => { code: 403, errors: [ {
          message: 'The user does not have permission to edit one or more nodes' 
        } ] }
      end
    end
end
