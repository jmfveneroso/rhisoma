class TerritoriesController < ApplicationController
  before_action :logged_in_user
  before_action :correct_user, only: [:update, :destroy]
  before_action :correct_user_or_public, only: [:show, :clone]

  # Gets all nodes and edges that belong to a user.
  # @route GET /node-groups
  def index
    @user = current_user
    render :json => {
      territories: @user.territories,
      # The JSON parse is necessary to select the type column.
      nodes: JSON.parse(@user.nodes.select(
        "nodes.id, title, type, territory_id, x, y, vx, vy, fx, fy"
      ).to_json(only: [
        :id, :title, :type, :territory_id, :x, :y, :vx, :vy, :fx, :fy
      ])),
      edges: @user.edges,
      templates: Territory.where(:public => true)
    }
  end

  # Creates a new node.
  # @route POST /node-groups
  # @route_param node-group [name]
  # @route_param node-group [public]
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
  # @route_param node-group [public]
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
      nodes: @territory.nodes,
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

    nodes = @territory.nodes
    if nodes.count > 0
      timestamp = Time.zone.now.getutc
      values = nodes.map { |n| 
        "(#{sqlize n.title},#{sqlize n.type},#{sqlize n.description}," + 
        "#{sqlize n.start_date},#{sqlize n.end_date}," + 
        "#{sqlize n.text},#{sqlize n.link},#{sqlize n.target_territory_id}," + 
        "#{sqlize n.active},#{sqlize n.hidden},#{@new_territory.id}," +
        "'#{timestamp}','#{timestamp}')" 
      }.join(",")

      fields = [:title, :type, :description, :start_date, 
                :end_date, :text, :link, :target_territory_id, :active, 
                :hidden, :territory_id, :created_at, :updated_at].join(",")

      id_map = {}
      res = ActiveRecord::Base.connection.execute("INSERT INTO nodes (#{fields}) VALUES #{values} RETURNING id")
      for i in (0..res.num_tuples - 1)
        id_map[nodes[i].id] = res[i]['id']
      end
    end

    edges = @territory.edges
    if edges.count > 0
      values = edges.map { |e| 
        source_id = 
        "(#{id_map[e.source_id]},#{id_map[e.target_id]},#{sqlize e.category})"
      }.join(",")

      fields = [:source_id, :target_id, :category].join(",")
      ActiveRecord::Base.connection.execute("INSERT INTO edges (#{fields}) VALUES #{values} RETURNING id")
    end

    render :json => @new_territory
  end

  private
  
    # Transforms an attribute in SQL friendly text.
    def sqlize(field)
      text = field
      text = field.getutc if field.is_a? ActiveSupport::TimeWithZone
      field ? ("'#{text}'") : 'NULL'  
    end

    # Allowed node group parameters in JSON requests.
    def territory_params
      if admin?
        params.require(:territory).permit(:name, :public)
      else
        params.require(:territory).permit(:name)
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
    # requested territory if it belongs to her or it is public.
    def correct_user_or_public
      @territory = Territory.find(params[:id])
      unless @territory.public || current_user?(@territory.user)
        render :status => 403, :json => { code: 403, errors: [ {
          message: 'Unauthorized user' 
        } ] }
      end
    end

    # Before filter that confirms the current user has permission to alter the
    # requested node group.
    def correct_user
      @territory = Territory.find(params[:id])
      unless current_user?(@territory.user)
        render :status => 403, :json => { code: 403, errors: [ {
          message: 'Unauthorized user' 
        } ] }
      end
    end
end
