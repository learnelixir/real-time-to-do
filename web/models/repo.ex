defmodule RealTimeToDo.Repo do
  use Ecto.Repo, adapter: Ecto.Adapters.Postgres

  def conf do
    parse_url "ecto://james:@localhost/to_dos"
  end

  def priv do
    app_dir(:real_time_to_do, "priv/repo")
  end
end
