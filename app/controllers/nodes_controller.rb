class NodesController < ApplicationController
  # before_action :logged_in_user
  # before_action :correct_user

  def new
    # create a new node.
  end

  # Shows the data of a single node.
  # @route GET /nodes/$(id)
  # @route_param node [id]
  def show
    # create a new node.
  end

  # Creates a new node.
  # @route POST /nodes
  # @route_param node [title]
  # @route_param node [type]
  def create
    @node = Node.new(node_params)
    @node.user = current_user
    if @node.save
      render :json => @node 
    else
      render :json => { errors: @node.errors }
    end
  end

  # Edits a new node.
  # @route PATCH /nodes
  # @route_param node [title]
  # @route_param node [type]
  def update
    @node = Node.find(params[:id])
    if @node.update_attributes(node_params)
      render :json => @node 
    else
      render :json => { errors: @node.errors }
    end
  end

  def delete
    # delete a node.
  end

  # Creates a new edge connecting two nodes.
  # @route POST /nodes/$(id)/connect
  # @route_param edge [target_id]
  def connect
    @node = Node.find(params[:id])
    if edge = @node.edges.create(target_id: params[:edge][:target_id])
      render :json => 'clach'
    else
      render :json => { errors: edge.errors }
    end
  end

  # Updates an edge connecting two nodes.
  # @route POST /nodes/edit_edge
  # @route_param edge [category]
  def update_edge
  end

  def delete_edge
    # delete an edge.
  end

  def get_graph
    # get all nodes and edges belonging to user. 
  end

  private

    # Allowed node params.
    def node_params
      params.require(:node).permit(:title, :type, :active, :hidden)
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
end
