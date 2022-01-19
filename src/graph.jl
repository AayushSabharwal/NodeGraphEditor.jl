export AbstractNodeParams,
    Node,
    Edge,
    NodeGraph,
    INPUT,
    OUTPUT

const INPUT = 0
const OUTPUT = 1

"""
    abstract type AbstractNodeParams end

Abstract type that should be implemented to create new nodes.
"""
abstract type AbstractNodeParams end

"""
    mutable struct Node

Represents a node in the graph. Each node has the following fields:
- `id::Int`: Unique identifier of the node
- `name::String`: Name of the node
- `x::Float64`, `y::Float64`: Position of the node
- `params::AbstractNodeParams`: Parameters of the node

Each node has a finite number of input and output connectors, which can be
used to join them to other nodes through [`Edge`](@ref)s. The number of
input and output connectors is found through the [`input`](@ref) and
[`output`](@ref) functions corresponding to the type-symbol of `params`.
"""
mutable struct Node{P<:AbstractNodeParams}
    id::Int
    name::String
    x::Float64
    y::Float64
    params::P
end

"""
    struct Edge

Represents an edge between two nodes in the graph. Each edge has the following
fields:
- `from::Int`: Source node ID
- `from_type::Int`: 0 if the edge is from an input connector, 1 if 
  from an output connector
- `from_conn::Int`: Source connector index
- `to::Int`: Destination node ID
- `to_type::Int`: 0 if the edge is from an input connector, 1 if
  from an output connector
- `to_conn::Int`: Destination connector index
"""
struct Edge
    from::Int
    from_type::Int
    from_conn::Int
    to::Int
    to_type::Int
    to_conn::Int
end

"""
    mutable struct NodeGraph

Struct containing vectors of the [`Node`](@ref)s and [`Edge`](@ref)s of
the graph.
"""
mutable struct NodeGraph
    nodes::Vector{Node}
    edges::Vector{Edge}
end

NodeGraph() = NodeGraph(Node[], Edge[])

function NodeGraph(path::String)
    load(path, "ng")
end

StructTypes.StructType(::Type{NodeGraph}) = StructTypes.Mutable()
StructTypes.StructType(::Type{Edge}) = StructTypes.Struct()
StructTypes.StructType(::Type{N}) where {N<:Node} = StructTypes.DictType()
StructTypes.keyvaluepairs(n::Node) = [
    :node_id => n.id,
    :node_name => n.name,
    :pos => (x = n.x, y = n.y),
    :inputs => inputs(typeof(n.params)),
    :outputs => outputs(typeof(n.params)),
]
StructTypes.StructType(::Type{T}) where {T<:AbstractNodeParams} = StructTypes.DictType()
StructTypes.keyvaluepairs(t::T) where {T<:AbstractNodeParams} = [
    :type => type_symbol(t),
    (p => to_editor_format(getproperty(t, p)) for p in propertynames(t))...
]
