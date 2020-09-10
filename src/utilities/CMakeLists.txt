# Compile to Utilities Library

# find the files to compile
if (DEFINED CMAKE_CUDA_COMPILER_ID)
file(GLOB SOURCES LIST_DIRECTORIES false *.cpp *.h *.cu)
else()
file(GLOB SOURCES LIST_DIRECTORIES false *.cpp *.h)
endif()

set(SOURCES ${SOURCES})

# Enable CUDA
if (DEFINED CMAKE_CUDA_COMPILER_ID)
	set_target_properties(TradeBot_utilities PROPERTIES CUDA_SEPARABLE_COMPILATION on)
	set_target_properties(TradeBot_utilities PROPERTIES CUDA_SEPARABLE_COMPILATION on)
endif()

add_library(TradeBot_utilities STATIC ${SOURCES})

## Libraries

# Enable threading
target_link_libraries(TradeBot_utilities ${CMAKE_THREAD_LIBS_INIT})

# QuantLib
target_link_libraries(TradeBot_utilities ${QuantLib_LIBRARIES})
target_link_directories(TradeBot_utilities PUBLIC ${QuantLib_INCLUDE_DIRS})

# JSON library linking
target_link_libraries(TradeBot_utilities ${Json_LIBRARIES})
target_include_directories(TradeBot_utilities ${Json_INCLUDE_DIRS})

# HTTP library linking
target_link_libraries(TradeBot_utilities ${HTTPLIB_LIBRARY})
target_include_directories(TradeBot_utilities PUBLIC ${httplib_INCLUDE_DIRS})

# libPQ library linking
target_link_libraries(TradeBot_utilities ${PostgreSQL_LIBRARIES})
target_include_directories(TradeBot_utilities PUBLIC ${PostgreSQL_INCLUDE_DIRS})

