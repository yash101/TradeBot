file(GLOB_RECURSE TEST_SOURCES LIST_DIRECTORIES false *.h *.cpp)
set(SOURCES ${TEST_SOURCES})

pkg_check_modules(QuantLib REQUIRED quantlib)

add_executable(unit_tests ${TEST_SOURCES})
target_link_libraries(unit_tests PUBLIC ${CMAKE_PROJECT_NAME}_lib gtest)
target_link_libraries(unit_tests PUBLIC ${CMAKE_PROJECT_NAME}_lib ${QuantLib_LIBRARIES})
target_include_directories(unit_tests PUBLIC ${CMAKE_PROJECT_NAME}_lib ${QuantLib_INCLUDE_DIRS})

add_test(NAME unit COMMAND ${CMAKE_BINARY_DIR}/${CMAKE_INSTALL_BINDIR}/unit_tests)