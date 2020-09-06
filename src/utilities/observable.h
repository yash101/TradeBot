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

		std::unordered_map<std::string, std::set<Observer*>> listeners;		//< tracks who is listening to what subject
		std::unordered_map<Observer*, std::set<std::string>> subscriptions;	//< holds all subscriptions for each observer
		mutable std::shared_mutex listeners_lock;							//< mutual exclusion to prevent race conditions

	public:

		/** \brief notifies all observers who are subscribed to \param subject with \param object
		* \param subject is the subject the recipients are subscribed to
		* \param object is an arbitrary pointer that is passed onto the recipients
		* \return true if any observer received the notification; false if no observer was subscribed to the subject of the notification
		*/
		bool
		notify(
			std::string subject,
			void* object
		);


		/** \brief subscribe observer \param observer to subject \param subject
		* \param subject is the subject observer will be subscribed to
		* \param observer is a pointer to the observer who is requesting subscription
		* \return true if successfully subscribed, false if observer was already subscribed to the subject
		* 
		* Note: will throw std::exception if observer is nullptr
		*/
		bool
		subscribe_subject(
			std::string subject,
			Observer* observer
		);


		/** \brief unsubscribes observer \param observer from subject \param subject
		* \param subject is the subject we would like to unsubscribe observer from
		* \param observer is the observer we are unsubscribing from subject \param subject
		* \return true if successfully unsubscribed; false if \param observable was not subscribed to \param subject
		*/
		bool
		unsubscribe_subject(
			std::string subject,
			Observer* observer
		);

		/** \brief returns true if observer \param observer is subscribed to \param subject
		* \param subject is the subject we are checking to see if \param observer is subscribed to
		* \param observer is the observer we are checking for a subscription to \param subject
		* \return true if observer is subscribed to subject \param subject; false if observer is not subsribed to \param observer
		*/
		bool
		is_subscribed(
			std::string subject,
			Observer* observer
		);


		/** \brief unsubscribes an observer from each subject it is subscribed to and scrubs its existence from this subcriptions server
		* \param observer is the observer we want to scrub existence from this subscriptions server from
		* \return true if unsubscribed; false if observer was not subscribed to anything before or observer = nullptr
		*/
		bool
		unsubscribe_observer(
			Observer* observer
		);

		
		/** \brief returns the global instance of the SubjectServer
		* \return static instance of the global SubjectServer
		* 
		* Use this throughout the application unless specifically necessary for whatever weird reason. This object instance is available throughout TradeBot
		*/
		static SubjectServer& instance();

	};


	/** \brief Observer class that can subscribe to subjects in SubjectServer and receive notifications
	* 
	* Override ::notify() to receive notifications in your base class
	*/
	class Observer
	{
	protected:
		
		friend class SubjectServer;	//< allows SubjectServer to call the ::notify() function


		/** \brief callback function for a notification
		* \param subject is the subject of the notification
		* \param object is the payload of the notification
		* 
		* override this function in your derived class to add your functionality
		* 
		* ensure this function runs fast and does not block the rest of the subscribers from getting notified. consider launching a thread to perform a task from here
		*/
		void
		virtual notify(
			std::string subject,
			void* object
		);

	};
}

#endif // !OBSERVABLE_H
