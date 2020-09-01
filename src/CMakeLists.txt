set(BINARY ${CMAKE_PROJECT_NAME})

file(GLOB_RECURSE SOURCES LIST_DIRECTORIES false *.cpp *.h)
set(SOURCES ${SOURCES})

pkg_check_modules(QuantLib REQUIRED quantlib)

add_executable(${BINARY} ${SOURCES})
target_link_libraries(${BINARY} ${QuantLib_LIBRARIES})
target_include_directories(${BINARY} PUBLIC ${QuantLib_INCLUDE_DIRS})

add_library(${BINARY}_lib STATIC ${SOURCES})
target_link_libraries(${BINARY}_lib ${QuantLib_LIBRARIES})
target_include_directories(${BINARY}_lib PUBLIC ${QuantLib_INCLUDE_DIRS})
