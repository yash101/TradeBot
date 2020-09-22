#include "../src/TradeBot/TradeBot.h"

/** \brief Entry point for TradeBot
*/
int main(int argc, char** argv)
{
	tb::TradeBot tbot;
	tbot.initialize(argc, argv);
	return 0;
}
