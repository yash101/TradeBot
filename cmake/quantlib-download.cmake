cmake_minimum_required(VERSION 3.5 FATAL_ERROR)

project(quantlib-download NONE)

include(ExternalProject)

ExternalProject_Add(
    quantlib
    SOURCE_DIR "@QUANTLIB_DOWNLOAD_ROOT@/quantlib-src"
    BINARY_DIR "@QUANTLIB_DOWNLOAD_ROOT@/quantlib-build"
    GIT_REPOSITORY https://github.com/lballabio/QuantLib.git
    CONFIGURE_COMMAND ""
    BUILD_COMMAND ""
    INSTALL_COMMAND ""
    TEST_COMMAND ""
)