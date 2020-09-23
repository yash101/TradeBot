#ifndef _TRADEBOT_DATABASE_H
#define _TRADEBOT_DATABASE_H

#include "TradeBot.h"

namespace tb
{
	namespace db
	{
		/** \brief Initializes a postgres database with the tables and information required by TradeBot
		* \param tradebot tradebot
		*/
		void
		initialize_db(
			tb::TradeBot& tradebot
		);
	}
}

#endif // !_TRADEBOT_DATABASE_H
