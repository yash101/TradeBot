cmake_minimum_required(VERSION 3.8 FATAL_ERROR)

# Project name
project(TradeBot CXX)

# CUDA Configuration
include(CheckLanguage)
check_language(CUDA)
if (DEFINED CMAKE_CUDA_COMPILER_ID)
    message("CUDA was found and has been enabled")
    message(${CMAKE_CUDA_COMPILER_ID})
    set(CMAKE_CUDA_STANDARD 17)
    set(CMAKE_CUDA_STANDARD_REQUIRED on)
    enable_language(CUDA)
    add_definitions(-DCUDA_SUPPORT=on)
else()
    message("CUDA was not found on this system and has been disabled")
endif()

# Get PKG Config
find_package(PkgConfig REQUIRED)
find_package(httplib REQUIRED)
find_package(Threads REQUIRED)
find_package(PostgreSQL REQUIRED)
find_package(httplib REQUIRED)

pkg_check_modules(QuantLib REQUIRED quantlib)
pkg_check_modules(Json REQUIRED nlohmann_json)

# Default installation directories
include(GNUInstallDirs)
set(CMAKE_ARCHIVE_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/${CMAKE_INSTALL_LIBDIR})
set(CMAKE_LIBRARY_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/${CMAKE_INSTALL_LIBDIR})
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/${CMAKE_INSTALL_BINDIR})

# Let's use C++ 17 :P
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Set up GCC / CLANG
if(CMAKE_CXX_COMPILER_ID MATCHES GNU)
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -fprofile-arcs -ftest-coverage -fPIC")
endif()

add_subdirectory(res)

# add the source files directory
add_subdirectory(src)

# add the targets directory
add_subdirectory(targets)

# set up GoogleTest
include(cmake/googletest.cmake)
fetch_googletest(${PROJECT_SOURCE_DIR}/cmake ${PROJECT_BINARY_DIR}/googletest)

# Set up testing
enable_testing()
add_subdirectory(test)
