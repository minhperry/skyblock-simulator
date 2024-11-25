#!/bin/bash


usage() {
  echo "Usage: $0 -f or -b"
  echo "    -f      Build and ship Frontend"
  echo "    -b      Build and ship Backend"
  exit 1
}


# Check if a parameter was provided
if [ "$#" -ne 1 ]; then
  usage
fi

buildAngular() {
  # Build Angular
  ng build --prod

  # Copy to VPS
  # -a: Archive mode; it preserves permissions, timestamps, and symlinks.
  # -v: Verbose; provides detailed output of the transfer.
  # --delete: Deletes files in the destination that are not present in the source.
  # --ignore-existing: Skips files that already exist on the destination. (opt)
  # --update: Only copies files that are newer than the existing files in the destination.

  # Old static deployment
  # rsync -av --delete --update dist/skyblock/browser/* "$VPS":/var/www/frontend/skyblock

  # SSR directory deployment
  rsync -av --delete --update dist/* "$VPS":/var/www/skyblock-ssr
}

doExit() {
  echo "Error occured! Exiting."
  exit
}

buildExpress() {
  cd ./skyblock-backend || doExit
  echo "Entered Backend. Building."
  npm run build || doExit
  echo "Build done! Copying .env"
  cp .env dist/ || doExit
  rsync -avP dist/.env "$VPS":/var/www/backend/sb-backend || doExit
  echo "Copying server.js"
  rsync -avP dist/server.backend.js "$VPS":/var/www/backend/sb-backend || doExit
  echo "Copied! Going back."
  cd ..
  echo "Exited!"
}

# Process the input options
while getopts "fb" opt; do
  case "$opt" in
    f)
      echo "Build and deploying Angular frontend."
      buildAngular
      ;;
    b)
      echo "Build and deploying Express backend."
      buildExpress
      ;;
    *)
      usage
      ;;
  esac
done
