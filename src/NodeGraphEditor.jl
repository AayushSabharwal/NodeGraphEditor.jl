module NodeGraphEditor

using Genie, Logging, LoggingExtras
using JLD2
using JSON3
using StructTypes

const CACHE_DIR = ".nodegraph_cache"
const NG_FILE_NAME = "data.jld2"
const NG_FILE = joinpath(CACHE_DIR, NG_FILE_NAME)
const PTYPES_FILE_NAME = "ptypes"
const PTYPES_FILE = joinpath(CACHE_DIR, PTYPES_FILE_NAME)
const NNID_FILE_NAME = "nnid"
const NNID_FILE = joinpath(CACHE_DIR, NNID_FILE_NAME)

include("graph.jl")
include("node_params_API.jl")
include("editor_formatting.jl")
include("file_interface.jl")
include("operations.jl")

export run_server

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
    set_nodegraph(ng)
    set_param_types(param_type_symbols)
    set_new_node_id(nn_id)
    Genie.up()
end

end
