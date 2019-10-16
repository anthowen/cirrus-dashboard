#!/usr/bin/env bash

export PYTHONPATH="..:.:${PYTHONPATH}"
unset DB_MODEL_RESET

python3 manage.py runserver