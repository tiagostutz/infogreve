#!/bin/sh
####################################
# Reiniciar o serviço do infogreve
####################################

cd /var/nodejswww/infogreve/

killall node

nohup forever /var/nodejswww/infogreve/infogreve.js &