#!/bin/bash
git pull
yarn
yarn build
serve -s build
