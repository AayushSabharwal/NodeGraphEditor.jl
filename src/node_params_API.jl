export type_symbol,
    inputs,
    outputs,
    create,
    validate_edge

notimplemented(t) = error("Not implemented for type-symbol $t")

"""
    type_symbol(::Type{T}) where {T<:AbstractNodeParams}

Returns a symbol that identifies the node type. This is used to create new
nodes of a particular type and get properties.

This function needs to be implemented for each node type.
"""
type_symbol(::Type{T}) where {T<:AbstractNodeParams} = notimplemented(T)

"""
    inputs(::Val{T}) where {T<:Symbol}

Returns the number of input connections a node type can accept. This function
dispatches on the type-symbol of the node type.

This function needs to be implemented for each node type.
"""
inputs(::Val{T}) where {T<:Symbol} = notimplemented(T)

"""
    outputs(::Val{T}) where {T<:Symbol}

Returns the number of output connections a node type can accept. This function
dispatches on the type-symbol of the node type.

This function needs to be implemented for each node type.
"""
outputs(::Val{T}) where {T<:Symbol} = notimplemented(T)

"""
    create(::Val{T}) where {T<:Symbol}

Creates and returns a new node of the type indicated by the type-symbol.

This function needs to be implemented for each node type.
"""
create(::Val{T}) where {T<:Symbol} = notimplemented(T)

"""
    validate_edge(::S, ::T, edge::D) where {S<:AbstractNodeParams,T<:AbstractNodeParams,D<:Dict}

Given a pair of nodes and a descriptor of an edge joining them, return `true` if the
edge is valid or `false` otherwise. Defaults to true. This function only needs to be
implemented if not all connections between any two nodes are valid.
"""
validate_edge(::S, ::T, edge::Edge) where {S<:AbstractNodeParams,T<:AbstractNodeParams} = true

inputs(::T) where {T<:AbstractNodeParams} = inputs(Val{type_symbol(T)}())
inputs(::Type{T}) where {T<:AbstractNodeParams} = inputs(Val{type_symbol(T)}())
outputs(::T) where {T<:AbstractNodeParams} = outputs(Val{type_symbol(T)}())
outputs(::Type{T}) where {T<:AbstractNodeParams} = outputs(Val{type_symbol(T)}())
create(::T) where {T<:AbstractNodeParams} = create(Val{type_symbol(T)}())
create(::Type{T}) where {T<:AbstractNodeParams} = create(Val{type_symbol(T)}())
type_symbol(::T) where {T<:AbstractNodeParams} = type_symbol(T)
