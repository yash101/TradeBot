#ifndef _CONFIGURATION_H
#define _CONFIGURATION_H

#ifndef DB_HOST
#define DB_HOST "127.0.0.1"
#endif

#ifndef DB_PORT
#define DB_PORT 5432
#endif

#ifndef DB_OPTIONS
#define DB_OPTIONS ""
#endif

#ifndef DB_TTY
#define DB_TTY ""
#endif

#ifndef DB_NAME
#define DB_NAME "TradeBotV2"
#endif

#ifndef DB_LOGIN
#define DB_LOGIN "TradeBot"
#endif

#ifndef DB_PASSWORD
#define DB_PASSWORD "TradeBotPassword"
#endif

#ifndef DEFAULT_DB_CONN_POOL_SIZE
#define DEFAULT_DB_CONN_POOL_SIZE 10
#endif

#endif
