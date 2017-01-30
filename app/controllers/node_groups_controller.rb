class NodeGroupsController < ApplicationController
  before_action :logged_in_user
  before_action :correct_user, only: [:update, :destroy]
  before_action :correct_user_or_public, only: [:show, :clone]

  # Gets all nodes and edges that belong to a user.
  # @route GET /node-groups
  def index
    @user = current_user
    render :json => {
      node_groups: @user.node_groups,
      # The JSON parse is necessary to select the type column.
      nodes: JSON.parse(@user.nodes.select(
        "nodes.id, title, type, node_group_id, x, y, vx, vy, fx, fy"
      ).to_json(only: [
        :id, :title, :type, :node_group_id, :x, :y, :vx, :vy, :fx, :fy
      ])),
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

  # Clones a node group and all its relations.
  # @route POST /node-groups/$(id)/clone
  def clone
    @new_node_group = NodeGroup.new(node_group_params)
    @new_node_group.user = current_user 
    if !@new_node_group.save
      render :json => { errors: @new_node_group.errors }
      return
    end

    nodes = @node_group.nodes
    if nodes.count > 0
      timestamp = Time.zone.now.getutc
      values = nodes.map { |n| 
        "(#{sqlize n.title},#{sqlize n.type},#{sqlize n.description}," + 
        "#{sqlize n.start_date},#{sqlize n.end_date}," + 
        "#{sqlize n.text},#{sqlize n.link},#{sqlize n.active}," + 
        "#{sqlize n.hidden},#{@new_node_group.id}," +
        "'#{timestamp}','#{timestamp}')" 
      }.join(",")

      fields = [:title, :type, :description, :start_date, 
                :end_date, :text, :link, :active, 
                :hidden, :node_group_id, :created_at, :updated_at].join(",")

      id_map = {}
      res = ActiveRecord::Base.connection.execute("INSERT INTO nodes (#{fields}) VALUES #{values} RETURNING id")
      for i in (0..res.num_tuples - 1)
        id_map[nodes[i].id] = res[i]['id']
      end
    end

    edges = @node_group.edges
    if edges.count > 0
      values = edges.map { |e| 
        source_id = 
        "(#{id_map[e.source_id]},#{id_map[e.target_id]},#{sqlize e.category})"
      }.join(",")

      fields = [:source_id, :target_id, :category].join(",")
      ActiveRecord::Base.connection.execute("INSERT INTO edges (#{fields}) VALUES #{values} RETURNING id")
    end

    render :json => @new_node_group
  end

  private
  
    # Transforms an attribute in SQL friendly text.
    def sqlize(field)
      text = field
      text = field.getutc if field.is_a? ActiveSupport::TimeWithZone
      field ? ("'#{text}'") : 'NULL'  
    end

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
