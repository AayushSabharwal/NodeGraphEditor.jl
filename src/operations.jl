export id_to_index,
    add_node!,
    delete_node!,
    update_node_name!,
    update_node_position!,
    update_node_params!,
    add_edge!,
    delete_edge!

id_to_index(id::Int, ng::NodeGraph) = findnext(n -> n.id == id, ng.nodes, 1)

function add_node!(ng::NodeGraph, type::Symbol, newnode_id::Int)
    new_params = create(Val{type}())
    push!(ng.nodes, Node(newnode_id, "new_$type", 0.0, 0.0, new_params))
end

function delete_node!(ng::NodeGraph, node_ind::Int)
    removed = popat!(ng.nodes, node_ind)
    filter!(e -> e.from != removed.id && e.to != removed.id, ng.edges)
end

function update_node_name!(ng::NodeGraph, node_ind::Int, new_name::String)
    ng.nodes[node_ind].name = new_name
end

function update_node_position!(ng::NodeGraph, node_ind::Int, x::Float64, y::Float64)
    ng.nodes[node_ind].x = x
    ng.nodes[node_ind].y = y
end

function update_node_params!(ng::NodeGraph, node_ind::Int, key::Symbol, value)
    update!(ng.nodes[node_ind].params, key, value)
end

function add_edge!(ng::NodeGraph, edge::Edge)
    edge in ng.edges && return false
    
    from_ind = id_to_index(edge.from, ng)
    to_ind = id_to_index(edge.to, ng)
    
    if validate_edge(ng.nodes[from_ind].params, ng.nodes[to_ind].params, edge)
        push!(ng.edges, edge)
        return true
    end
    return false
end

function delete_edge!(ng::NodeGraph, edge::Edge)
    filter!(e -> e != edge, ng.edges)
end