export get_nodegraph,
    get_param_types,
    get_new_node_id,
    set_param_types

"""
    get_nodegraph()

Returns the underlying [`NodeGraph`](@ref)
"""
get_nodegraph() = load(NG_FILE, "ng")

"""
    get_param_types()

Returns the types of nodes that can be created, as a list of their type-symbols.
"""
get_param_types() = Symbol.(readlines(PTYPES_FILE))

"""
    get_new_node_id()

Returns the ID of the next node that will be created
"""
get_new_node_id() = read(NNID_FILE, Int)

"""
    set_nodegraph(ng::NodeGraph)

Sets the currently active [`NodeGraph`](@ref). Usage of this function
should not be required. To edit a pre-existing node graph, pass it to
[`run_server`](@ref).
"""
set_nodegraph(ng::NodeGraph) = jldsave(NG_FILE; ng)

"""
    set_param_types(types::Vector{Symbol})

Sets the types of nodes that can be created. Requires a list of valid
type-symbols.
"""
set_param_types(types::Vector{Symbol}) = write(PTYPES_FILE, join(types, "\n"))

"""
    set_new_node_id(nn_id::Int)

Sets the ID of the next node to be created.
"""
set_new_node_id(nn_id::Int) = write(NNID_FILE, nn_id)