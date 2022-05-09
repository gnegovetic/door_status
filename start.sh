#! /bin/bash
echo "Starting Node"
docker-compose -f ./docker-compose.yaml up -d
echo "Done."

# On raspberry, call from /etc/rc.local
# Copy above script to ec2 user data from AWS EC2 console
# Make sure /var/lib/cloud/* is empty on the ec2 machine

