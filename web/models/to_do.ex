defmodule ToDo do
  use Ecto.Model

  schema "to_dos" do
    field :description, :string
    field :checked, :boolean
    field :updated_at, :datetime
  end
end
