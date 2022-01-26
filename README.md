# NodeGraphEditor.jl

NodeGraphEditor.jl is a package for creating browser-based interactive NodeGraphs using Julia. It supports defining node types and data in pure Julia,
and allows them to be rendered in a browser window.

# Getting Started

To define a new node type, create a struct which subtypes `AbstractNodeParams`. NodeGraphEditor.jl requires the following methods to be implemented for each such type:

```julia
type_symbol(::Type{T}) # The type_symbol uniquely identifies a node type
inputs(::Val{T}) where {T<:Symbol} # Here `T` is the type_symbol of the node type
outputs(::Val{T}) where {T<:Symbol}
create(::Val{T}) where {T<:Symbol}
validate_edge(::S, ::T, edge::Edge) where {S<:AbstractNodeParams,T<:AbstractNodeParams} # optional
```

For further information on these functions, refer to their docstrings. An example usage can be found in `examples/circuit.jl`.

The parameters of each node type can be viewed and edited in the side-panel of the editor. NodeGraphEditor.jl detects the type of
struct fields and correspondingly renders an appropriate UI element:

- `Integer`, `Unsigned`, `AbstractFloat`: Simple numeric values have a numeric input field, which validates input to ensure it is of the appropriate type
- `Bool`: A checkbox is displayed
- `Base.Enum`: Enum types created using `@enum` are displayed as a dropdown menu. The possible values of the `Enum` are found using the `instances` method
- `Clamped{T}`: A custom type defined in NodeGraphEditor.jl which displays a slider

Fields of a node can be selectively displayed by defining a method for `Base.propertynames`, and returning only the names that should be displayed. Additionally, `Base.getproperty` and `Base.setproperty!` can be used to perform any validation of edited values or to display custom values that are derived from the values in the struct.

Inside the editor, nodes can be added using the blue "Add Node" button in the top right corner. Each node can be renamed by selecting (clicking on) it and editing the name at the top of the side panel. Nodes can be deleted by selecting them and pressing the red delete button at the top right corner of the side panel. Nodes can be moved around by clicking and dragging them. Edges can be drawn by clicking on a connector, and dragging to another connector on a different node. To delete an edge, simply click on the edge. Pan around the editor by dragging with the right mouse button, and use the scroll wheel or the buttons in the bottom left to zoom.

# Contributing

The frontend code is in the `frontend` directory. To compile it into the `public` folder (required), run `npm run build` from inside the `frontend` directory. Alternatively, run `npm --prefix frontend run build` from the root directory.

Any issues, PRs and suggestions are welcome.
