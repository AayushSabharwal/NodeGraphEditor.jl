mutable struct VoltageSource <: AbstractNodeParams
    voltage::Float64
end

Nodegraph.type_symbol(::Type{VoltageSource}) = :voltage_source
Nodegraph.inputs(::Val{:voltage_source}) = 1
Nodegraph.outputs(::Val{:voltage_source}) = 1
Nodegraph.create(::Val{:voltage_source}) = VoltageSource(1.0)
function Nodegraph.update!(v::VoltageSource, key::Symbol, value)
    key == :voltage || return "No key matching $key"
    v.voltage = value
    nothing
end

mutable struct Resistance <: AbstractNodeParams
    resistance::Float64
end

Nodegraph.type_symbol(::Type{Resistance}) = :resistance
Nodegraph.inputs(::Val{:resistance}) = 1
Nodegraph.outputs(::Val{:resistance}) = 1
Nodegraph.create(::Val{:resistance}) = Resistance(1.0)
function Nodegraph.update!(r::Resistance, key::Symbol, value::F) where {F<:AbstractFloat}
    key == :resistance || return "No key matching $key"
    r.resistance = value
    nothing
end
