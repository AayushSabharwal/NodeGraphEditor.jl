"""
to_editor_format(t::T)

Returns the value `t` in the format it should be sent to render. By default, this
returns `Dict(:value => t, :type => Symbol(T))`. This should be overloaded for
complex types.
"""
to_editor_format(t::T) where {T} = Dict(:type => Symbol(T), :value => t)
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

to_editor_format(t::T) where {T<:Clamped} = Dict(
    :type => :clamped,
    :min => t.min,
    :max => t.max,
    :value => t.value,
)
