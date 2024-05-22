sudo docker run -p 0.0.0.0:3003:3003/tcp -d --restart=always --env-file=/home/admin/sites/i-exist/.env.production twilingway/we-exist:0.0.19
sudo docker ps -a
sudo docker stop <container ID>
sudo docker rm <container ID>
docker run 
docker-compose --env-file ./.env up

npx prisma migrate dev --name add-default