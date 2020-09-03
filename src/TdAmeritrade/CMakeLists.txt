# this builds an authentication server for one-time authentication with td ameritrade

add_executable(tdauthsvr authenticationsvr.cpp authenticationsvr.h ../web_essentials.h ../web_essentials.cpp ../stringutils.h ../stringutils.cpp)

find_package(Threads)

target_link_libraries(tdauthsvr ${Json_LIBRARIES})
target_include_directories(tdauthsvr PUBLIC ${Json_INCLUDE_DIRS})

target_link_libraries(tdauthsvr ${CMAKE_THREAD_LIBS_INIT})

target_link_libraries(tdauthsvr ${HTTPLIB_LIBRARY})
target_include_directories(tdauthsvr PUBLIC ${httplib_INCLUDE_DIRS})

target_compile_definitions(tdauthsvr PRIVATE BUILD_TD_AUTHSERVER_SEPARATE=true)
