#!/usr/bin/env sh

npm install --silent

if [ -z "$NODE_ENV" ]; then
	export NODE_ENV="development"
fi

if [ -d "/usr/src/common" ]; then
	(cd /usr/src/common; npm run build)
fi

if [ "$NODE_ENV" == "production" ]; then
	npm run build
	exec npm run start
else
	exec npm run dev
fi
