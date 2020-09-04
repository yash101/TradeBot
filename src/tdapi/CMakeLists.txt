# this builds an authentication server for one-time authentication with td ameritrade

add_executable(
	tdauthsvr
	authenticationsvr.cpp
	authenticationsvr.h
)

find_package(Threads REQUIRED)
find_package(httplib REQUIRED)
find_package(PostgreSQL REQUIRED)

target_link_libraries(tdauthsvr ${CMAKE_THREAD_LIBS_INIT})
target_link_libraries(tdauthsvr ${BINARY}_lib)
target_link_libraries(tdauthsvr ${HTTPLIB_LIBRARY})

target_link_libraries(tdauthsvr ${PostgreSQL_LIBRARY})
target_include_directories(tdauthsvr PUBLIC ${PostgreSQL_INCLUDE_DIRS})

target_compile_definitions(tdauthsvr PRIVATE BUILD_TD_AUTHSERVER_SEPARATE=true)
