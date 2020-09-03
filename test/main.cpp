#include "main.h"

#include "gtest/gtest.h"

using namespace testing;

#ifndef DISABLE_TRADEBOT_MAIN

int main(int argc, char** argv)
{
    InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}

#endif