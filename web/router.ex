defmodule RealTimeToDo.Router do
  use Phoenix.Router
  use Phoenix.Router.Socket, mount: "/ws"
  scope "/" do
    # Use the default browser stack.
    pipe_through :browser
    get "/", RealTimeToDo.ToDosController, :index, as: :root
    channel "to_dos", RealTimeToDo.ToDoChannel
  end
end
