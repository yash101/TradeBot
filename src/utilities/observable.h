#ifndef OBSERVABLE_H
#define OBSERVABLE_H

#include <set>
#include <string>
#include <unordered_map>
#include <shared_mutex>

namespace tb
{
	class SubjectServer;
	class Observer;


	/** \brief routes objects, tagged with a subject, to observers subscribed to the specified subject
	* 
	* This class implements the observer design pattern
	*/
	class SubjectServer
	{
	protected:

		std::unordered_map<std::string, std::set<Observer*>> listeners;
		mutable std::shared_mutex listeners_lock;

	public:

		bool
		notify(
			std::string subject,
			void* object
		);

		
		bool
		subscribe_subject(
			std::string subject,
			Observer* observer
		);

		bool
		unsubscribe_subject(
			std::string subject,
			Observer* observer
		);

		bool
		is_subscribed(
			std::string subject,
			Observer* observer
		);

		
		static SubjectServer& instance();

	};

	class Observer
	{
	protected:
		
		friend class SubjectServer;

		void
		virtual notify(
			std::string subject,
			void* object
		);

	};
}

#endif // !OBSERVABLE_H
