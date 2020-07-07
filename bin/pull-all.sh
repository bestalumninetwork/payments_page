#!/bin/bash
# ex: set tabstop=8 softtabstop=0 expandtab shiftwidth=4 smarttab:

set -eu

for file in $(find . -name Dockerfile); do
    image_and_tag="$(sed -nE 's/FROM[[:space:]]+//p' "${file}")"

    docker pull "${image_and_tag}"
done

docker-compose pull

