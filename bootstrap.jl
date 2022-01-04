(pwd() != @__DIR__) && cd(@__DIR__) # allow starting app from bin/ dir

using Nodegraph
push!(Base.modules_warned_for, Base.PkgId(Nodegraph))
Nodegraph.main()
