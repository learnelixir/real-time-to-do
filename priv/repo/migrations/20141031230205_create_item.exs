defmodule RealTimeToDo.Repo.Migrations.CreateItem do
  use Ecto.Migration

  def up do
    "CREATE TABLE items( \
          id serial primary key, \
          description text, \
          position integer, \
          done boolean, \
          updated_at timestamp)"
  end 

  def down do
    "DROP TABLE items"
  end 
end
