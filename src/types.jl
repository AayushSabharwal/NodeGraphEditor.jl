abstract type NodeProperties end

function create_properties(::Val) end
function inputs(::Type{<:NodeProperties}) end
function outputs(::Type{<:NodeProperties}) end

struct Node
    name::Symbol
    inputs::Int
    outputs::Int
    position::NTuple{2,Float64}
    properties::NodeProperties
end

mutable struct NodeGraph{G<:MetaGraph}
    nodes::Dict{Symbol,Node}
    graph::G
    next_id::Int
end

NodeGraph() = NodeGraph(
    Dict{Symbol,Node}(),
    MetaGraph(  # graph of connectors
        SimpleDiGraph();
        Label = Symbol, # :node_type_number
    ),
    0,
)

JSON3.StructTypes.StructType(::Type{<:NodeGraph}) = JSON3.StructTypes.DictType()

JSON3.StructTypes.keyvaluepairs(x::NodeGraph) = Dict(
    :nodes => x.nodes,
    :graph => Dict(
        v => Symbol[x.graph.vertex_labels[i] for i in outneighbors(x.graph, k)] for
        (k, v) in x.graph.vertex_labels
    ),
)
