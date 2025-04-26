import uuid
import os
from dotenv import load_dotenv

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STORAGE_PATH = os.getenv("STORAGE_PATH")
DIRECTORY = os.path.join(BASE_DIR, '..', STORAGE_PATH)  # Navigate to the 'public' folder inside your project
STORAGE_PATH = os.path.abspath(STORAGE_PATH)

class BlobStorage:
    @staticmethod
    def upload_file(directory: str, user_id:str, file_name:str, data: str):
        directory_path = os.path.join(STORAGE_PATH, directory, str(user_id))
        os.makedirs(directory_path, exist_ok=True)
        file_path = os.path.join(directory_path, file_name)
        with open(file_path, 'w') as file:
            file.write(data)


    @staticmethod
    def generate_uuid():
        return uuid.uuid4()