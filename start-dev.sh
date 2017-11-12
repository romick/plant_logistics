#!/bin/bash
export MONGO_URL="mongodb://localhost:27017/plant_logistics_dev" 
echo $MONGO_URL
meteor --settings ./settings-dev.json