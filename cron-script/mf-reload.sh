#!/bin/bash
##############################
# mf-reload.sh
#
# cron実行用
##############################
set -ue

SHL_DIR=$(cd $(dirname $0); pwd)
LIB_DIR=${SHL_DIR}/lib
if [ -f "${LIB_DIR}/functions.sh" ]; then
    . ${LIB_DIR}/functions.sh
else
    echo "functions.sh not found." >&2
    exit 1
fi

repo_dir="$(cd $(dirname ${SHL_DIR}); pwd)"
compose_yml="${repo_dir}/docker-compose.yml"

function compose_cmd() {
    docker-compose -f ${compose_yml} "$@"
}

##############################
# Script main
##############################
LOGHEADER

if [ -z "$(compose_cmd ps selenium-client | grep 'Up')" ]; then
    INFO_MSG 'launch selenium client container.'
    compose_cmd up -d selenium-client
fi

INFO_MSG 'execute mf-reload.js.'
compose_cmd exec selenium-client node mf-reload.js 2>&1 | tee -a ${LOG}

LOGFOOTER
exit
