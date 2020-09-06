#include <gtest/gtest.h>

#include "main.h"
#include "../src/utilities/observable.h"

#include <string>

class TestObservable : public tb::Observer
{
protected:

	void
	virtual notify(
		std::string subject,
		void* object
	)
	{
		last_subject = subject;
		last_int = *reinterpret_cast<int*>(object);
	}

public:

	std::string last_subject;
	int last_int;

};

TEST(Observer, SubscribeTest)
{
	TestObservable obs;
	tb::SubjectServer server;

	EXPECT_EQ(true, server.subscribe_subject("test_subject", &obs));
	EXPECT_EQ(true, server.is_subscribed("test_subject", &obs));
	EXPECT_EQ(true, server.unsubscribe_subject("test_subject", &obs));

	server.unsubscribe_subject("test_subject", &obs);
	EXPECT_EQ(false, server.is_subscribed("test_subject", &obs));
	EXPECT_EQ(false, server.unsubscribe_subject("test_subject", &obs));
	EXPECT_EQ(false, server.is_subscribed("test_subject", &obs));
}

TEST(Observer, NotifyTest)
{
	TestObservable obs;
	tb::SubjectServer server;
	int testint;

	EXPECT_EQ(true, server.subscribe_subject("test_sub1", &obs));
	EXPECT_EQ(true, server.subscribe_subject("test_sub2", &obs));
	EXPECT_EQ(false, server.subscribe_subject("test_sub1", &obs));
	EXPECT_EQ(true, server.subscribe_subject("test_sub3", &obs));

	testint = 1;
	EXPECT_EQ(true, server.notify("test_sub1", reinterpret_cast<void*>(&testint)));
	EXPECT_EQ("test_sub1", obs.last_subject);
	EXPECT_EQ(testint, obs.last_int);

	EXPECT_EQ(false, server.notify("test_sub_dne", reinterpret_cast<void*>(&testint)));
	EXPECT_EQ("test_sub1", obs.last_subject);
	EXPECT_EQ(testint, obs.last_int);

	testint = 10;
	EXPECT_EQ(true, server.notify("test_sub3", reinterpret_cast<void*>(&testint)));
	EXPECT_EQ("test_sub3", obs.last_subject);
	EXPECT_EQ(testint, obs.last_int);

	EXPECT_EQ(true, server.unsubscribe_subject("test_sub1", &obs));

	EXPECT_EQ(false, server.notify("test_sub1", reinterpret_cast<void*>(&testint)));
	EXPECT_EQ("test_sub3", obs.last_subject);
	EXPECT_EQ(testint, obs.last_int);
}
