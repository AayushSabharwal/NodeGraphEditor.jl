# Define a struct subtype of `AbstractNodeParams`
mutable struct VoltageSource <: AbstractNodeParams
    voltage::Float64
end

# The type-symbol should uniquely identify the type of node
NodeGraphEditor.type_symbol(::Type{VoltageSource}) = :voltage_source
# The number of inputs (left-hand side connectors)
NodeGraphEditor.inputs(::Val{:voltage_source}) = 1
# The number of outputs (right-hand side connectors)
NodeGraphEditor.outputs(::Val{:voltage_source}) = 1
# Returns a default voltage source
NodeGraphEditor.create(::Val{:voltage_source}) = VoltageSource(1.0)

# Similarly for a resistance
mutable struct Resistance <: AbstractNodeParams
    resistance::Float64
end

NodeGraphEditor.type_symbol(::Type{Resistance}) = :resistance
NodeGraphEditor.inputs(::Val{:resistance}) = 1
NodeGraphEditor.outputs(::Val{:resistance}) = 1
NodeGraphEditor.create(::Val{:resistance}) = Resistance(1.0)
