use Mix.Config

# ## SSL Support
#
# To get SSL working, you will need to set:
#
#     https: [port: 443,
#             keyfile: System.get_env("SOME_APP_SSL_KEY_PATH"),
#             certfile: System.get_env("SOME_APP_SSL_CERT_PATH")]
#
# Where those two env variables point to a file on
# disk for the key and cert.

config :phoenix, RealTimeToDo.Router,
  url: [host: "example.com"],
  http: [port: System.get_env("PORT")],
  secret_key_base: "kGxxEPnBAejO3gQw2/LReVUh0qPemkF/+DhEWrjA8lXj5W4HYpMTuFrjJLvVV7th9BPjduZjwdYz3DeSBAZSQQ=="

config :logger, :console,
  level: :info

config :firebase, :url, "https://real-time-to-do.firebaseio.com"
