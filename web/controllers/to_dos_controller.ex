defmodule RealTimeToDo.ToDosController do
  use Phoenix.Controller
  alias RealTimeToDo.Repo
  import Ecto.Query

  plug :action
  
  def index(conn, _params) do
    to_do_items = Repo.all(Item 
                            |> where([item], item.done == false) 
                            |> order_by([item], asc: item.position))

    done_items = Repo.all(Item 
                            |> where([item], item.done == true) 
                            |> order_by([item], asc: item.position))

    render conn, "index", to_do_items: to_do_items, done_items: done_items  
  end
end
