#!/bin/bash
git pull
yarn build
serve -s build
