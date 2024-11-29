#!/bin/bash

buildAngular() {
  # Build Angular
  ng build --configuration=production

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

# Process the input options

echo "Build and deploying SSR Angular."
buildAngular || doExit

