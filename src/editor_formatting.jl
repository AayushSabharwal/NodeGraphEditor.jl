export Clamped

"""
to_editor_format(t::T)

Returns the value `t` in the format it should be sent to render. By default, this
returns `Dict(:value => t, :type => Symbol(T))`. This should be overloaded for
complex types.
"""
to_editor_format(t::T) where {T} = Dict(:type => Symbol(T), :value => t)
to_editor_format(t::T) where {T<:Number} = Dict(
    :type => :num,
    :num_type => T <: Unsigned ? :unsigned : T <: Integer ? :integer : :float,
    :value => t
)
to_editor_format(t::T) where {T<:Base.Enum} = Dict(
    :type => :enum,
    :options => Symbol.(instances(T)),
    :value => Int(t),
)

struct Clamped{T<:Number}
    min::T
    max::T
    value::T
end

StructTypes.StructType(::Type{<:Clamped}) = StructTypes.Struct()

Base.convert(::Type{Clamped{T}}, x::Clamped{U}) where {T,U} =
    Clamped{T}(T(x.min), T(x.max), T(x.value))

to_editor_format(t::Clamped{T}) where {T<:Number} = Dict(
    :type => :clamped,
    :num_type => T <: Unsigned ? :unsigned : T <: Integer ? :integer : :float,
    :min => t.min,
    :max => t.max,
    :value => t.value,
)
