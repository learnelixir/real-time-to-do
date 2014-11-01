defmodule RealTimeToDo.ToDoChannel do
  use Phoenix.Channel
  alias RealTimeToDo.Repo
  import Ecto.Query

  def join(socket, "list", message) do
    {:ok, socket}
  end

  def event(socket, "create:item", data) do
    item = create_item(data["description"])
    item_html = Phoenix.View.render RealTimeToDo.ToDosView, "item.html", item: item
    broadcast socket, "create:item", %{item_html: item_html}
    socket
  end

  def event(socket, "toggle:item", data) do
    item = toggle_item(data["item_id"])
    broadcast socket, "toggle:item", %{item: item}
    socket
  end

  def event(socket, "delete:item", data) do
    item = delete_item(data["item_id"]) 
    broadcast socket, "delete:item", %{item: item}
    socket
  end

  def event(socket, "update:item", data) do
    item_id = data["item_id"]
    item_description = data["description"]
    item = update_item(item_id, item_description)
    broadcast socket, "update:item", %{item: item}
    socket
  end

  def event(socket, "arrange:items", data) do
    update_positions(data["item_ids"])
    broadcast socket, "arrange:items", %{item_ids: data["item_ids"], for_list: data["for_list"]}
    socket
  end

  defp create_item(description) do
    Repo.insert(%Item{description: description, done: false})
  end

  defp update_positions(item_ids) do
    item_ids = String.split(item_ids, ",")
                      |> Enum.map fn item_id -> String.to_integer(item_id) end

    items = Repo.all(Item |> where([item], item.id in array(^item_ids, :integer)))
    item_hash = Enum.reduce items, %{}, fn item, map -> Map.put(map, item.id, item) end

    item_ids 
      |> Stream.with_index 
      |> Enum.each fn {item_id, index} -> 
        item = item_hash[item_id]
        IO.puts(inspect item)
        Repo.update(%{item | position: index + 1}) 
      end
  end

  defp toggle_item(item_id) do
    item = Repo.get(Item, String.to_integer(item_id))
    item = %{item | done: !item.done}
    Repo.update(item)
    item
  end

  def update_item(item_id, description) do
    item = Repo.get(Item, String.to_integer(item_id))
    item = %{item | description: description}
    Repo.update(item)
    item
  end

  def delete_item(item_id) do
    item = Repo.get(Item, String.to_integer(item_id))
    Repo.delete(item)
    item
  end
end
