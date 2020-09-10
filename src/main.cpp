#include "TradeBot/TradeBot.h"

/** \brief Entry point for TradeBot
*/
int main(int argc, char** argv)
{
	tb::TradeBot::instance().initialize(argc, argv);

	return 0;
}
