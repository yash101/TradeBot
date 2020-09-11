add_executable(TradeBot TradeBot.cpp)
target_link_libraries(TradeBot TradeBotLib)

add_executable(TdAuthSvr TdAuthSvr.cpp)
target_link_libraries(TdAuthSvr TradeBotLib)
