# enable CUDA
if (DEFINED CMAKE_CUDA_COMPILER_ID)
	set_target_properties(${BINARY} PROPERTIES CUDA_SEPARABLE_COMPILATION on)
	set_target_properties(${BINARY}_lib PROPERTIES CUDA_SEPARABLE_COMPILATION on)
	file(GLOB_RECURSE SOURCES LIST_DIRECTORIES false *.h *.cpp *.cu)
else()
	file(GLOB_RECURSE SOURCES LIST_DIRECTORIES false *.h *.cpp)
endif()

# turn TradeBot into a library
add_library(TradeBotLib SHARED ${SOURCES})
target_link_libraries(TradeBotLib ${QuantLib_LIBRARIES})
target_link_libraries(TradeBotLib ${Json_LIBRARIES})
target_link_libraries(TradeBotLib ${CURL_INCLUDE_DIRS})
target_link_libraries(TradeBotLib ${PostgreSQL_LIBRARIES})
target_link_libraries(TradeBotLib TradeBot_Resources)
target_link_libraries(TradeBotLib ${HTTPLIB_LIBRARY})

target_include_directories(TradeBotLib PUBLIC ${QuantLib_INCLUDE_DIRS})
target_include_directories(TradeBotLib PUBLIC ${Json_INCLUDE_DIRS})
target_include_directories(TradeBotLib PUBLIC ${CURL_INCLUDE_DIRS})
target_include_directories(TradeBotLib PUBLIC ${PostgreSQL_INCLUDE_DIRS})
target_include_directories(TradeBotLib PUBLIC ${httplib_INCLUDE_DIRS})

add_subdirectory(utilities)
add_subdirectory(TradeBot)
add_subdirectory(tdapi)
add_subdirectory(quant)
add_subdirectory(fred)
