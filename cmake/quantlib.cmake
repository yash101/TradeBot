macro(fetch_quantlib _download_module_path _download_root)
    set(QUANTLIB_DOWNLOAD_ROOT ${_download_root})
    configure_file(
        ${_download_module_path}/quantlib-download.cmake
        ${_download_root}/CMakeLists.txt
        @ONLY
    )
    unset(QUANTLIB_DOWNLOAD_ROOT)

    execute_process(
        COMMAND "${CMAKE_COMMAND}" --build .
        WORKING_DIRECTORY ${_download_root}
    )

    add_subdirectory(
        ${_download_root}/quantlib-src
        ${_download_root}/quantlib-build
    )
endmacro()