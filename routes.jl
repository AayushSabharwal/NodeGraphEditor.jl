using Genie.Router, Genie.Requests, Genie.Renderer.Json
using JSON3

id_to_index(id::Int, ng::NodeGraph) = findnext(n -> n.id == id, ng.nodes, 1)

route("/") do
    serve_static_file("index.html")
end

route("/graph", method = GET) do
    JSON3.write(load(CACHE_FILE, "ng"))
end

route("/addnode/:add_type::Symbol", method = POST) do
    ng, types, nn_id = load(CACHE_FILE, "ng", "types", "nn_id")
    add_type = payload(:add_type)
    if !(add_type in types)
        return Genie.Router.error(404, "Invalid node type $add_type", MIME"text/html")
    end
    new_params = create(Val{add_type})
    push!(ng.nodes, Node(nn_id, "new_$add_type", 0.0, 0.0, new_params))
    jldsave(CACHE_FILE; nb, types, nn_id)

    return JSON3.write(ng)
end

route("/updatenode/:id::Int", method = POST) do
    ng = load(CACHE_FILE, "ng")
    id = payload(:id)
    index = id_to_index(id, ng)
    isnothing(index) && return Genie.Router.error(404, "Invalid node_id: $id", MIME"text/html")

    msg = jsonpayload()
    println(msg)
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

    jldsave(CACHE_FILE; ng)
    return JSON3.write(ng)
end

route("/updateparams/:id::Int", method = POST) do
    ng = load(CACHE_FILE, "ng")
    id = payload(:id)
    index = findnext(n -> n.id == id, ng.nodes, 1)
    isnothing(index) && return Genie.Router.error(404, "Invalid node_id: $id", MIME"text/html")

    msg = jsonpayload()

    # TODO
    println(typeof(msg))
    println(msg)

    haskey(msg, "key") || return Genie.Router.error(400, "Key `key` required in `updatenode` payload", MIME"text/html")
    haskey(msg, "value") || return Genie.Router.error(400, "Value `value` required in `updatenode` payload", MIME"text/html")

    key = Symbol(msg["key"])
    value = msg["value"]

    ret = update!(ng.nodes[index].params, key, value)

    isnothing(ret) || return Genie.Router.error(400, ret, MIME"text/html")

    jldsave(CACHE_FILE; ng)

    return JSON3.write(ng)
end

route("/addedge", method = POST) do
    ng = load(CACHE_FILE, "ng")
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
    jldsave(CACHE_FILE; ng)
    println("H");
    return JSON3.write(ng)
end

route("/deletenode/:id", method = POST) do
    ng = load(CACHE_FILE, "ng")
    id = payload(:id)
    ind = id_to_index(id, ng)
    isnothing(ind) && return Genie.Router.error(404, "Invalid ID: $id", MIME"text/html")
    
    popat!(ng.node, ind)
    filter!(e -> e.from == id || e.to == id, ng.edges)
    
    jldsave(CACHE_FILE; ng)

    return JSON3.write(ng)
end
