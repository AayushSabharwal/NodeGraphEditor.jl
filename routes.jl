using Genie.Router, Genie.Requests, Genie.Renderer.Json
using JSON3

id_to_index(id::Int, ng::NodeGraph) = findnext(n -> n.id == id, ng.nodes, 1)

route("/") do
    serve_static_file("index.html")
end

route("/graph", method = GET) do
    JSON3.write(Nodegraph.get_nodegraph())
end

route("/addnode/:add_type::String", method = POST) do
    ng = Nodegraph.get_nodegraph()
    types = Nodegraph.get_param_types()
    nn_id = Nodegraph.get_new_node_id()

    add_type = Symbol(payload(:add_type))
    println(add_type)
    println(types)
    if !(add_type in types)
        return Genie.Router.error(404, "Invalid node type $add_type", MIME"text/html")
    end
    new_params = create(Val{add_type}())
    push!(ng.nodes, Node(nn_id, "new_$add_type", 0.0, 0.0, new_params))

    Nodegraph.set_nodegraph(ng)
    Nodegraph.set_new_node_id(nn_id)

    return JSON3.write(ng)
end

route("/updatenode/:id::Int", method = POST) do
    ng = Nodegraph.get_nodegraph()
    id = payload(:id)
    index = id_to_index(id, ng)
    isnothing(index) && return Genie.Router.error(404, "Invalid node_id: $id", MIME"text/html")

    msg = jsonpayload()
    haskey(msg, "key") || return Genie.Router.error(400, "Key `key` required in `updatenode` payload", MIME"text/html")
    haskey(msg, "value") || return Genie.Router.error(400, "Value `value` required in `updatenode` payload", MIME"text/html")
    
    key = Symbol(msg["key"])
    value = msg["value"]
    params_type = type_symbol(ng.nodes[index].params)

    if key == :name
        ng.nodes[index].name = value
    elseif key == :pos
        ng.nodes[index].x = value["x"]
        ng.nodes[index].y = value["y"]
    else
        return Genie.Router.error(400, "Invalid key: $key", MIME"text/html")
    end

    Nodegraph.set_nodegraph(ng)
    return JSON3.write(ng)
end

route("/updateparams/:id::Int", method = POST) do
    ng = Nodegraph.get_nodegraph()

    id = payload(:id)
    index = findnext(n -> n.id == id, ng.nodes, 1)
    isnothing(index) && return Genie.Router.error(404, "Invalid node_id: $id", MIME"text/html")

    msg = jsonpayload()

    haskey(msg, "key") || return Genie.Router.error(400, "Key `key` required in `updatenode` payload", MIME"text/html")
    haskey(msg, "value") || return Genie.Router.error(400, "Value `value` required in `updatenode` payload", MIME"text/html")

    key = Symbol(msg["key"])
    value = msg["value"]

    ret = update!(ng.nodes[index].params, key, value)

    isnothing(ret) || return Genie.Router.error(400, ret, MIME"text/html")

    Nodegraph.set_nodegraph(ng)

    return JSON3.write(ng)
end

route("/addedge", method = POST) do
    ng = Nodegraph.get_nodegraph()

    edge = jsonpayload()
    from = id_to_index(edge["from"], ng)
    if isnothing(from)
        return Genie.Router.error(404, "Invalid from_node: $(edge["from"])", MIME"text/html")
    end
    to = id_to_index(edge["to"], ng)
    if isnothing(to)
        return Genie.Router.error(404, "Invalid to_node: $(edge["to"])", MIME"text/html")
    end
    from_type_fn = edge["from_type"] == INPUT ? inputs : outputs
    if !(0 ≤ edge["from_conn"] ≤ from_type_fn(ng.nodes[from].params))
        return Genie.Router.error(400, "Invalid from_conn: $(edge["from_conn"])", MIME"text/html")
    end
    to_type_fn = edge["to_type"] == INPUT ? inputs : outputs
    if !(0 ≤ edge["to_conn"] ≤ to_type_fn(ng.nodes[to].params))
        return Genie.Router.error(400, "Invalid to_conn: $(edge["to_conn"])", MIME"text/html")
    end

    isvalid = validate_edge(ng.nodes[from].params, ng.nodes[to].params, Dict(edge))
    isvalid || return Genie.Router.error(400, "Invalid connection", MIME"text/html")
    push!(
        ng.edges,
        Edge(
            edge["from"],
            edge["from_conn"],
            edge["from_type"],
            edge["to"],
            edge["to_conn"],
            edge["to_type"]
        )
    )

    Nodegraph.set_nodegraph(ng)
    return JSON3.write(ng)
end

route("/deleteedge", method = POST) do
    ng = Nodegraph.get_nodegraph()

    edge = jsonpayload()
    filter!(
        e -> e.from != edge["from"] ||
            e.to != edge["to"] ||
            e.from_conn != edge["from_conn"] ||
            e.to_conn != edge["to_conn"] ||
            e.from_type != edge["from_type"] ||
            e.to_type != edge["to_type"],
        ng.edges
    )
    Nodegraph.set_nodegraph(ng)
    
    return JSON3.write(ng)
end

route("/deletenode/:id::Int", method = POST) do
    ng = Nodegraph.get_nodegraph()

    id = payload(:id)
    ind = id_to_index(id, ng)
    isnothing(ind) && return Genie.Router.error(404, "Invalid ID: $id", MIME"text/html")
    
    popat!(ng.nodes, ind)
    filter!(e -> e.from != id && e.to != id, ng.edges)
    
    Nodegraph.set_nodegraph(ng)

    return JSON3.write(ng)
end

route("/types", method = GET) do
    types = Nodegraph.get_param_types()
    return JSON3.write(Dict(:types => types))
end
