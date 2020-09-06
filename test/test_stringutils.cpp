#include <gtest/gtest.h>

#include "main.h"
#include "../src/utilities/stringutils.h"

/* TEST DISABLED because the base functionality has not been implemented
TEST(Stringutils_SplitString, MainTest)
{
	//
}
*/

/* TEST DISABLED because the base functionality has not been implemented
TEST(Stringutils_StringJoin, MainTest)
{
}
*/

TEST(Stringutils_Hex, HexToDec)
{
	EXPECT_EQ(0xa, tb::tools::read_hex('a'));
	EXPECT_EQ(0xa, tb::tools::read_hex('A'));
	EXPECT_EQ(0x0, tb::tools::read_hex('0'));
	EXPECT_EQ(0x7, tb::tools::read_hex('7'));
	EXPECT_EQ(0x0, tb::tools::read_hex('Z'));
}

TEST(Stringutils_Hex, NumToHex)
{
	EXPECT_EQ('a', tb::tools::to_hex(0xa, false));
	EXPECT_EQ('b', tb::tools::to_hex(0xb, false));
	EXPECT_EQ('0', tb::tools::to_hex(0x0, false));
	EXPECT_EQ('7', tb::tools::to_hex(0x7, false));
	EXPECT_EQ('A', tb::tools::to_hex(0xa, true));
	EXPECT_EQ('B', tb::tools::to_hex(0xb, true));
	EXPECT_EQ('2', tb::tools::to_hex(0xb2, false));
}