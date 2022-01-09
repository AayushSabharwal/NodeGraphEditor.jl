module Nodegraph

using Genie, Logging, LoggingExtras
using JLD2

include("graph.jl")

const CACHE_DIR = ".nodegraph_cache"
const CACHE_FILE_NAME = "data.jld2"
const CACHE_FILE = joinpath(CACHE_DIR, CACHE_FILE_NAME)

function __init__()
    Genie.genie(; context = @__MODULE__)
    Core.eval(Main, :(using Genie))
    isdir(CACHE_DIR) || mkdir(CACHE_DIR)
end

function run_server(
    ng::NodeGraph = NodeGraph(),
    param_type_symbols::Vector{Symbol} = []
)
    nn_id = 0
    for node in ng.nodes
        nn_id = max(nn_id, node.id + 1)
    end
    push!(param_type_symbols, :nothing)
    JLD2.jldsave(CACHE_FILE; ng, types = param_type_symbols, nn_id)
    Genie.up()
end

end
