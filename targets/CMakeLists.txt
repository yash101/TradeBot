add_executable(TradeBot TradeBot.cpp)
target_link_libraries(TradeBot TradeBotLib)

add_executable(TradeBot.TDAuthenticationServer "TDAuthenticationServer.cpp")
target_link_libraries(TradeBot.TDAuthenticationServer TradeBotLib)

add_executable(TradeBot.DatabaseInitializer "InitializeTradebotDatabase.cpp")
target_link_libraries(TradeBot.DatabaseInitializer TradeBotLib)
