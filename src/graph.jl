using JLD2
using JSON3
using StructTypes

export Node,
    Edge,
    NodeGraph,
    AbstractNodeParams,
    icon,
    editor_fields,
    inputs,
    outputs,
    INPUT,
    OUTPUT

abstract type AbstractNodeParams end

icon(::AbstractNodeParams) = ""
editor_fields(t::AbstractNodeParams) =
    (k => getfield(t, k) for k in fieldnames(typeof(t)))

struct NoNodeParams <: AbstractNodeParams end

editor_fields(::NoNodeParams) = ()
inputs(::Type{NoNodeParams}) = 1
outputs(::Type{NoNodeParams}) = 1

const INPUT = 0
const OUTPUT = 1

mutable struct Node
    id::Int
    name::String
    x::Float64
    y::Float64
    params::AbstractNodeParams
end


struct Edge
    from::Int
    from_conn::Int
    from_type::Int
    to::Int
    to_conn::Int
    to_type::Int
end

mutable struct NodeGraph
    nodes::Vector{Node}
    edges::Vector{Edge}
end

NodeGraph() = NodeGraph(Node[], Edge[])

function NodeGraph(path::String)
    load(path, "nodegraph")
end

StructTypes.StructType(::Type{NodeGraph}) = StructTypes.Mutable()
StructTypes.StructType(::Type{Edge}) = StructTypes.Struct()
StructTypes.StructType(::Type{Node}) = StructTypes.DictType()
StructTypes.keyvaluepairs(n::Node) = [
    :node_id => n.id,
    :node_name => n.name,
    :pos => (x = n.x, y = n.y),
    :icon => icon(n.params),
    :inputs => inputs(typeof(n.params)),
    :outputs => outputs(typeof(n.params)),
    :params => Dict(
        editor_fields(n.params)...
    )
]