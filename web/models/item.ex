defmodule Item do
  use Ecto.Model

  schema "items" do
    field :description, :string
    field :done, :boolean
    field :position, :integer
    field :updated_at, :datetime
  end 
end
