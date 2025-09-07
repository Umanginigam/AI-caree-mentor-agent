from pymongo import MongoClient
import os

MONGO_URI = os.getenv("MONGO_URI", "mongodb://career_mentor_mongo:27017")
MONGO_DB = os.getenv("MONGO_DB", "career_mentor")

client = MongoClient(MONGO_URI)
db = client[MONGO_DB]
