set(BINARY ${CMAKE_PROJECT_NAME})

file(GLOB_RECURSE SOURCES LIST_DIRECTORIES false *.cpp *.h)
set(SOURCES ${SOURCES})

pkg_check_modules(QuantLib REQUIRED quantlib)
pkg_check_modules(Json REQUIRED nlohmann_json)
find_package(CURL REQUIRED)

add_executable(${BINARY} ${SOURCES})

target_link_libraries(${BINARY} ${QuantLib_LIBRARIES})
target_include_directories(${BINARY} PUBLIC ${QuantLib_INCLUDE_DIRS})

target_link_libraries(${BINARY} ${Json_LIBRARIES})
target_include_directories(${BINARY} PUBLIC ${Json_INCLUDE_DIRS})

target_link_libraries(${BINARY} ${CURL_LIBRARIES})
target_include_directories(${BINARY} PUBLIC ${CURL_INCLUDE_DIRS})

# target_link_libraries(${BINARY} ${SOCI_LIBRARIES})
# target_include_directories(${BINARY} PUBLIC ${SOCI_INCLUDE_DIRS})

add_library(${BINARY}_lib STATIC ${SOURCES})

target_link_libraries(${BINARY}_lib ${QuantLib_LIBRARIES})
target_include_directories(${BINARY}_lib PUBLIC ${QuantLib_INCLUDE_DIRS})

target_link_libraries(${BINARY}_lib ${Json_LIBRARIES})
target_include_directories(${BINARY}_lib PUBLIC ${Json_INCLUDE_DIRS})

target_link_libraries(${BINARY}_lib ${CURL_LIBRARIES})
target_include_directories(${BINARY}_lib PUBLIC ${CURL_INCLUDE_DIRS})

# target_link_libraries(${BINARY}_lib ${SOCI_LIBRARIES})
# target_include_directories(${BINARY}_lib PUBLIC ${SOCI_INCLUDE_DIRS})
