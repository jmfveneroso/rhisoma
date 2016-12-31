class NodeGroupsController < ApplicationController
  # Gets all nodes and edges of a graph.
  # @route GET /node-groups/$(id)
  # @route_param node [title]
  # @route_param node [type]
  def show
    node = Node.new(node_params)
    if node.save
      render :json => node 
    else
      render :status => 400, :json => { code: 400, errors: node.errors }
    end
  end
end
