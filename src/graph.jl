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
notimplemented(t) = error("Not implemented for type-symbol $t")

type_symbol(::Type{T}) where {T<:AbstractNodeParams} = notimplemented(T)
icon(::T) where {T<:AbstractNodeParams} = ""
inputs(::Val{T}) where {T<:Symbol} = notimplemented(T)
outputs(::Val{T}) where {T<:Symbol} = notimplemented(T)
create(::Val{T}) where {T<:Symbol} = notimplemented(T)
update!(::T, key::Symbol, value) where {T<:AbstractNodeParams} = notimplemented(T)
validate_edge(::S, ::T, edge::D) where {S<:AbstractNodeParams,T<:AbstractNodeParams,D<:Dict} = true
editor_fields(t::T) where {T<:AbstractNodeParams} = (k => getfield(t, k) for k in fieldnames(typeof(t)))

inputs(::T) where {T<:AbstractNodeParams} = inputs(Val{type_symbol(T)}())
inputs(::Type{T}) where {T<:AbstractNodeParams} = inputs(Val{type_symbol(T)}())
outputs(::T) where {T<:AbstractNodeParams} = outputs(Val{type_symbol(T)}())
outputs(::Type{T}) where {T<:AbstractNodeParams} = outputs(Val{type_symbol(T)}())
create(::T) where {T<:AbstractNodeParams} = create(Val{type_symbol(T)}())
create(::Type{T}) where {T<:AbstractNodeParams} = create(Val{type_symbol(T)}())
type_symbol(::T) where {T<:AbstractNodeParams} = type_symbol(T)

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
        :type => type_symbol(n.params),
        editor_fields(n.params)...
    )
]