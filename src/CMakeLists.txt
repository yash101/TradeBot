# get the name of the main output binary
set(BINARY ${CMAKE_PROJECT_NAME})

# find the files to compile
if (DEFINED CMAKE_CUDA_COMPILER_ID)
file(GLOB_RECURSE SOURCES LIST_DIRECTORIES false *.cpp *.h *.cu)
else()
file(GLOB_RECURSE SOURCES LIST_DIRECTORIES false *.cpp *.h)
endif()
set(SOURCES ${SOURCES})

# enable CUDA
if (DEFINED CMAKE_CUDA_COMPILER_ID)
	set_target_properties(${BINARY} PROPERTIES CUDA_SEPARABLE_COMPILATION on)
	set_target_properties(${BINARY}_lib PROPERTIES CUDA_SEPARABLE_COMPILATION on)
endif()

# find libraries
pkg_check_modules(QuantLib REQUIRED quantlib)
pkg_check_modules(Json REQUIRED nlohmann_json)

# find packages
find_package(httplib REQUIRED)
find_package(Threads REQUIRED)
find_package(Poco REQUIRED COMPONENTS Foundation Net)
find_package(PostgreSQL REQUIRED)

# add the binary output files - the binary and the library
add_executable(${BINARY} ${SOURCES})
add_library(${BINARY}_lib STATIC ${SOURCES})

# Enable threading
target_link_libraries(${BINARY} ${CMAKE_THREAD_LIBS_INIT})
target_link_libraries(${BINARY}_lib ${CMAKE_THREAD_LIBS_INIT})

# QuantLib linking
target_link_libraries(${BINARY} ${QuantLib_LIBRARIES})
target_include_directories(${BINARY} PUBLIC ${QuantLib_INCLUDE_DIRS})

target_link_libraries(${BINARY}_lib ${QuantLib_LIBRARIES})
target_include_directories(${BINARY}_lib PUBLIC ${QuantLib_INCLUDE_DIRS})

# JSON library linking
target_link_libraries(${BINARY} ${Json_LIBRARIES})
target_include_directories(${BINARY} PUBLIC ${Json_INCLUDE_DIRS})

target_link_libraries(${BINARY}_lib ${Json_LIBRARIES})
target_include_directories(${BINARY}_lib PUBLIC ${Json_INCLUDE_DIRS})

# HTTP library linking
target_link_libraries(${BINARY} ${HTTPLIB_LIBRARY})
target_include_directories(${BINARY} PUBLIC ${httplib_INCLUDE_DIRS})

target_link_libraries(${BINARY}_lib ${httplib_LIBRARIES})
target_include_directories(${BINARY}_lib PUBLIC ${httplib_INCLUDE_DIRS})

# libPQ library linking
target_link_libraries(${BINARY} ${PostgreSQL_LIBRARIES})
target_include_directories(${BINARY} PUBLIC ${PostgreSQL_INCLUDE_DIRS})

target_link_libraries(${BINARY}_lib ${PostgreSQL_LIBRARIES})
target_include_directories(${BINARY}_lib PUBLIC ${PostgreSQL_INCLUDE_DIRS})

# Build the TD Ameritrade authenticator separately
add_subdirectory(tdapi)
