# this builds an authentication server for one-time authentication with td ameritrade

add_executable(tdauthsvr authenticationsvr.cpp authenticationsvr.h)

find_package(Threads)

target_link_libraries(tdauthsvr ${Json_LIBRARIES})
target_include_directories(tdauthsvr PUBLIC ${Json_INCLUDE_DIRS})
target_link_libraries(tdauthsvr ${httplib_LIBRARIES})
target_link_libraries(tdauthsvr ${CMAKE_THREAD_LIBS_INIT})
target_include_directories(tdauthsvr PUBLIC ${httplib_INCLUDE_DIRS})

target_compile_definitions(tdauthsvr PRIVATE BUILD_AS_EXECUTABLE=true)