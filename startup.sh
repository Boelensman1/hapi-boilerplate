#!/bin/sh
set -e  # exit on error
NODE="$NVMEXEC node"
NPX="$NVMEXEC npx"
SENTRYDSN=`$NODE ./util/getSentryDSN.js`

exec $NODE . | \
  $NPX pino-tee trace ./logs/audit.log warn ./logs/warn.log error ./logs/error.log fatal ./logs/fatal.log | \
  jq 'select(.level >= 40)' -c | \
  $NPX pino-sentry --dsn $SENTRYDSN
