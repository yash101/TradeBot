macro(fetch_soci _download_module_path _download_root)
    set(SOCI_DOWNLOAD_ROOT ${_download_root})
    configure_file(
        ${_download_module_path}/soci-download.cmake
        ${_download_root}/CMakeLists.txt
        @ONLY
    )

    unset(SOCI_DOWNLOAD_ROOT)

    set(SOCI_CXX11 ON)

    execute_process(
        COMMAND "${CMAKE_COMMAND}" -G "${CMAKE_GENERATOR}" .
        WORKING_DIRECTORY ${_download_root}
    )

    execute_process(
        COMMAND "${CMAKE_COMMAND}" --build .
        WORKING_DIRECTORY ${_download_root}
    )

    add_subdirectory(
        ${_download_root}/soci-src
        ${_download_root}/soci-build
    )
endmacro()