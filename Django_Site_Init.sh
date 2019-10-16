#!/usr/bin/env bash

export PYTHONPATH="..:.:${PYTHONPATH}"
export DB_MODEL_RESET="1"


python3 manage.py migrate --run-syncdb