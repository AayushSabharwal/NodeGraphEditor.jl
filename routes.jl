using Genie.Router
using JSON3

route("/") do
    serve_static_file("index.html")
end

route("/graph", method = GET) do
    JSON3.write(Main.UserApp.ACTIVE_GRAPH[])
end

route("/addnode", method = POST) do
    
end