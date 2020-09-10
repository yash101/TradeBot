# get the name of the main output binary
set(BINARY ${CMAKE_PROJECT_NAME})

# enable CUDA
if (DEFINED CMAKE_CUDA_COMPILER_ID)
	set_target_properties(${BINARY} PROPERTIES CUDA_SEPARABLE_COMPILATION on)
	set_target_properties(${BINARY}_lib PROPERTIES CUDA_SEPARABLE_COMPILATION on)
endif()

# find the files to compile
if (DEFINED CMAKE_CUDA_COMPILER_ID)
file(GLOB_RECURSE SOURCES LIST_DIRECTORIES false *.cpp *.cu)
else()
file(GLOB_RECURSE SOURCES LIST_DIRECTORIES false *.cpp)
endif()
file(GLOB_RECURSE HEADERS LIST_DIRECTORIES false *.h)
set(HEADERS ${HEADERS})

# add the binary output files - the binary and the library
add_executable(TradeBot main.cpp ${HEADERS})
add_library(TradeBotLib ${SOURCES} ${HEADERS})

# Build the TD Ameritrade authenticator separately
add_subdirectory(TradeBot)
add_subdirectory(tdapi)
add_subdirectory(fred)
add_subdirectory(quant)
add_subdirectory(utilities)
