#include "observable.h"

#include <iostream>

bool
tb::SubjectServer::notify(
	std::string subject,
	void* object
)
{
	// allow simultaneous reads, exclusive writes
	std::shared_lock lck(listeners_lock);

	auto recipients = listeners[subject];

	// we notified no one so return false as feedback
	if (recipients.empty())
		return false;

	for (auto recipient = recipients.begin(); recipient != recipients.end(); ++recipient)
	{
		try
		{
			(*recipient)->notify(
				subject,
				object
			);
		}
		catch (...)
		{
			std::cerr
				<< "Exception was thrown while notifying " << reinterpret_cast<void*>(*recipient)
				<< " with subject \"" << subject << "\""
				<< std::endl;
		}
	}
	
	return true;
}


bool
tb::SubjectServer::subscribe_subject(
	std::string subject,
	Observer* observer
)
{
	// writes should be exclusive
	std::unique_lock lck(listeners_lock);

	// let's not add the subject twice
	if (listeners[subject].find(observer) != listeners[subject].end())
		return false;

	listeners[subject].insert(observer);

	return true;
}


bool
tb::SubjectServer::unsubscribe_subject(
	std::string subject,
	Observer* observer
)
{
	// writes should be exclusive
	std::unique_lock lck(listeners_lock);

	// not subscribed. fail with false
	if (listeners[subject].find(observer) == listeners[subject].end())
		return false;

	listeners[subject].erase(observer);

	return true;
}


bool
tb::SubjectServer::is_subscribed(
	std::string subject,
	Observer* observer
)
{
	// multiple simultaneous reads allowed
	std::shared_lock lck(listeners_lock);

	return listeners[subject].find(observer) != listeners[subject].end();
}


tb::SubjectServer&
tb::SubjectServer::instance()
{
	static SubjectServer server;
	return server;
}


void
tb::Observer::notify(
	std::string subject,
	void* object
)
{
	std::cout << "Observer default notify function was triggered. Please inherit this function from a child class to use the notification data." << std::endl;
	std::cout << "Subject received: \"" << subject << "\"" << std::endl;
}
