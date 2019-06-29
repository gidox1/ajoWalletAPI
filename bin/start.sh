#image name
IMAGE_NAME="ajowallet"

#Gets the directory of the script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

#Sets app root directory
ROOT="$(dirname "${SCRIPT_DIR}")"

#Starts up the disposable docker container
docker-compose -p ajo_wallet up -d

echo " ----- Starting Disposable Docker Container -----"

#link app to our disposable container.
docker run \
    -i \
    -t \
    -p 9191:9191 \
    -v ${ROOT}:/var/www/ \
    --env-file=${ROOT}/.env \
    --network=${IMAGE_NAME}_main_network \
    ${IMAGE_NAME} \
    sh -c "npm install && bash"

echo " ----- EXITED from disposable container -----"
echo " ----- Removing Exited Containers. -----"

# Now grep through all containers and stop those that have been "exited". Only do that for our service.
docker ps -a | grep Exited | awk '{ print $1,$2 }' | \
grep ${IMAGE_NAME} |  awk '{print $1 }' | xargs -I {} docker rm {}
