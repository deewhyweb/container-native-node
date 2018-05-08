RED='\033[0;31m'
NC='\033[0m' # No Color
if [[ -z "${MONGO_DBNAME}" ]] || [[ -z "${MONGO_CONNECTION_STRING}" ]]; then
  printf "${RED}Environment variable not set.${NC}\nRequired environment variables are:\nMONGO_DBNAME\nMONGO_CONNECTION_STRING\n"
  exit 1
fi
  echo "Running node application"   
  npm start
