using Genie.Router, Genie.Requests, Genie.Renderer.Json
using JSON3

route("/") do
    serve_static_file("index.html")
end

route("/graph", method = GET) do
    JSON3.write(NodeGraphEditor.get_nodegraph())
end

route("/addnode/:add_type::String", method = POST) do
    types = NodeGraphEditor.get_param_types()
    
    add_type = Symbol(payload(:add_type))
    
    if !(add_type in types)
        return Genie.Router.error(404, "Invalid node type $add_type", MIME"text/html")
    end

    ng = NodeGraphEditor.get_nodegraph()
    nn_id = NodeGraphEditor.get_new_node_id()

    add_node!(ng, add_type, nn_id)
    
    nn_id += 1

    NodeGraphEditor.set_nodegraph(ng)
    NodeGraphEditor.set_new_node_id(nn_id)

    return JSON3.write(ng)
end

route("/updatenode/:id::Int/:key::String", method = POST) do
    ng = NodeGraphEditor.get_nodegraph()
    id = payload(:id)
    index = id_to_index(id, ng)
    isnothing(index) && return Genie.Router.error(404, "Invalid node_id: $id", MIME"text/html")
    
    key = Symbol(payload(:key))
    value = jsonpayload()["value"]

    if key == :name
        update_node_name!(ng, index, value)
    elseif key == :pos
        update_node_position!(ng, index, Float64(value["x"]), Float64(value["y"]))
    else
        return Genie.Router.error(400, "Invalid key: $key", MIME"text/html")
    end

    NodeGraphEditor.set_nodegraph(ng)
    return JSON3.write(ng)
end

route("/updateparams/:id::Int/:key::String", method = POST) do
    ng = NodeGraphEditor.get_nodegraph()

    id = payload(:id)
    index = findnext(n -> n.id == id, ng.nodes, 1)
    isnothing(index) && return Genie.Router.error(404, "Invalid node_id: $id", MIME"text/html")

    key = Symbol(payload(:key))
    value = rawpayload()

    update_node_params!(ng, index, key, value)

    NodeGraphEditor.set_nodegraph(ng)
    return JSON3.write(ng.nodes[index].params)
end

route("/getparams/:id::Int", method = GET) do
    ng = NodeGraphEditor.get_nodegraph()

    id = payload(:id)
    index = findnext(n -> n.id == id, ng.nodes, 1)
    isnothing(index) && return Genie.Router.error(404, "Invalid node_id: $id", MIME"text/html")

    return JSON3.write(ng.nodes[index].params)
end

route("/addedge", method = POST) do
    ng = NodeGraphEditor.get_nodegraph()

    edge = JSON3.read(rawpayload(), Edge)

    isvalid = add_edge!(ng, edge)

    isvalid || return Genie.Router.error(400, "Invalid connection", MIME"text/html")

    NodeGraphEditor.set_nodegraph(ng)
    return JSON3.write(ng)
end

route("/deleteedge", method = POST) do
    ng = NodeGraphEditor.get_nodegraph()

    edge = JSON3.read(rawpayload(), Edge)

    delete_edge!(ng, edge)
    
    NodeGraphEditor.set_nodegraph(ng)
    
    return JSON3.write(ng)
end

route("/deletenode/:id::Int", method = POST) do
    ng = NodeGraphEditor.get_nodegraph()

    id = payload(:id)
    ind = id_to_index(id, ng)
    isnothing(ind) && return Genie.Router.error(404, "Invalid ID: $id", MIME"text/html")
    
    delete_node!(ng, ind)
    
    NodeGraphEditor.set_nodegraph(ng)

    return JSON3.write(ng)
end

route("/types", method = GET) do
    types = NodeGraphEditor.get_param_types()
    return JSON3.write(Dict(:types => types))
end
