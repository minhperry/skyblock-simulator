#!/bin/bash

# Build Angular
ng build

# Copy to VPS
# -a: Archive mode; it preserves permissions, timestamps, and symlinks.
# -v: Verbose; provides detailed output of the transfer.
# --delete: Deletes files in the destination that are not present in the source.
# --ignore-existing: Skips files that already exist on the destination. (opt)
# --update: Only copies files that are newer than the existing files in the destination.
rsync -av --delete --update dist/skyblock/browser/* "$VPS":/var/www/frontend/skyblock

