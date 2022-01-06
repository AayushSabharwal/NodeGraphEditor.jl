module Nodegraph

using Genie, Logging, LoggingExtras

include("graph.jl")

const ACTIVE_GRAPH = Ref{NodeGraph}(NodeGraph())

function __init__()
    Core.eval(Main, :(const UserApp = $(@__MODULE__)))

    Genie.genie(; context = @__MODULE__)

    Core.eval(Main, :(const Genie = UserApp.Genie))
    Core.eval(Main, :(using Genie))
end

function run(ng::NodeGraph)
    ACTIVE_GRAPH[] = ng
    Main.Genie.up()
end

end
