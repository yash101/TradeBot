#include <gtest/gtest.h>

#include "../src/utilities/web_essentials.h"

using Params = std::unordered_map<std::string, std::string>;

TEST(Webessentials, Urlencode1)
{
	ASSERT_EQ("", tb::tools::urlencode(""));
}

TEST(Webessentials, Urlencode2)
{
	ASSERT_EQ("hello", tb::tools::urlencode("hello"));
}

TEST(Webessentials, Urlencode3)
{
	ASSERT_EQ("%25hello%25world%24_W", tb::tools::urlencode("%hello%world$_W"));
}

TEST(Webessentials, Urlencode4)
{
	ASSERT_EQ("%25", tb::tools::urlencode("%"));
}

TEST(Webessentials, Urlencode5)
{
	ASSERT_EQ("%0A", tb::tools::urlencode("\n"));
}


TEST(Webessentials, Urldecode1)
{
	ASSERT_EQ("\n", tb::tools::urldecode("%0A"));
}

TEST(Webessentials, Urldecode2)
{
	ASSERT_EQ("%hello%world$_W", tb::tools::urldecode("%25hello%25world%24_W"));
}

TEST(Webessentials, Urldecode3)
{
	ASSERT_EQ("hello", tb::tools::urldecode("hello"));
}

TEST(Webessentials, Urldecode4)
{
	ASSERT_EQ("", tb::tools::urldecode(""));
}

TEST(Webessentials, Urldecode5)
{
	ASSERT_EQ("%", tb::tools::urldecode("%25"));
}

TEST(Webessentials, ParseParams1)
{
	Params p1 = tb::tools::parse_params("");
	ASSERT_EQ(p1.size(), 0);
}

TEST(Webessentials, ParseParams2)
{
	Params p2 = tb::tools::parse_params("a");
	ASSERT_EQ(p2.size(), 1);
	ASSERT_EQ(p2["a"], "");
}

TEST(Webessentials, ParseParams3)
{
	Params p3 = tb::tools::parse_params("&");
	ASSERT_EQ(p3.size(), 0);
}

TEST(Webessentials, ParseParams4)
{
	Params p4 = tb::tools::parse_params("=");
	ASSERT_EQ(p4.size(), 1);
	ASSERT_EQ(p4[""], "");
}

TEST(Webessentials, ParseParams5)
{
	Params p5 = tb::tools::parse_params("a=");
	ASSERT_EQ(p5.size(), 1);
	ASSERT_EQ(p5["a"], "");
}

TEST(Webessentials, ParseParams6)
{
	Params p6 = tb::tools::parse_params("=b");
	ASSERT_EQ(p6.size(), 1);
	ASSERT_EQ(p6[""], "b");
}

TEST(Webessentials, ParseParams7)
{
	Params p7 = tb::tools::parse_params("a=b");
	ASSERT_EQ(p7.size(), 1);
	ASSERT_EQ(p7["a"], "b");
}

TEST(Webessentials, ParseParams8)
{
	Params p8 = tb::tools::parse_params("a=b&b=c&c=&d=b");
	ASSERT_EQ(p8.size(), 4);
	ASSERT_EQ(p8["a"], "b");
	ASSERT_EQ(p8["b"], "c");
	ASSERT_EQ(p8["c"], "");
	ASSERT_EQ(p8["d"], "b");
}

TEST(Webessentials, GenerateQuery1)
{
	Params p;
	ASSERT_EQ("", tb::tools::generate_query(p));
}

TEST(Webessentials, GenerateQuery2)
{
	Params p({
		{"a", ""}
	});
	ASSERT_EQ("a=", tb::tools::generate_query(p));
}

TEST(Webessentials, GenerateQuery3)
{
	Params p({
		{"a", "b"}
	});
	ASSERT_EQ("a=b", tb::tools::generate_query(p));
}

TEST(Webessentials, GenerateQuery4)
{
	Params p({
		{"", "b"}
	});
	ASSERT_EQ("=b", tb::tools::generate_query(p));
}

TEST(Webessentials, GenerateQuery6)
{
	Params p;
	ASSERT_EQ("", tb::tools::generate_query(p));
}

TEST(Webessentials, GenerateQuery7)
{
	Params p;
	ASSERT_EQ("", tb::tools::generate_query(p));
}

TEST(Webessentials, GenerateQuery8)
{
	Params p;
	ASSERT_EQ("", tb::tools::generate_query(p));
}
