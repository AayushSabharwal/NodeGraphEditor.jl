abstract type NodeProperties end

function create_properties(::Val) end
function inputs(::Type{<:NodeProperties}) end
function outputs(::Type{<:NodeProperties}) end

struct Node
    id::Int
    name::Symbol
    inputs::Int
    outputs::Int
    position::NTuple{2,Float64}
    properties::NodeProperties
end

mutable struct NodeGraph{G<:MetaGraph}
    nodes::Dict{Int,Node}
    graph::G
    next_id::Int
end

struct Connector
    node::Int
    type::Symbol
    index::Int
end

NodeGraph() = NodeGraph(Dict{Int,Node}(), MetaGraph(  # graph of connectors
    SimpleDiGraph();
    Label = Connector,
), 0)

JSON3.StructTypes.StructType(::Type{<:NodeGraph}) = JSON3.StructTypes.DictType()

JSON3.StructTypes.keyvaluepairs(x::NodeGraph) = Dict(
    :nodes => x.nodes,
    :edges => [
        (src = x.graph.vertex_labels[e.src], dst = x.graph.vertex_labels[e.dst]) for e in edges(x.graph)
    ],
)
