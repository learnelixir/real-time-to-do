defmodule RealTimeToDo.Repo.Migrations.CreateToDo do
  use Ecto.Migration

  def up do
    "CREATE TABLE to_dos( \
          id serial primary key, \
          description text, \
          checked boolean, \
          updated_at timestamp)"
  end

  def down do
    "DROP TABLE to_dos"
  end
end
