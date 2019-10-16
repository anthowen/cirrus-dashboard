from django.apps import AppConfig
import os


class AnalyzerConfig(AppConfig):
    name = 'analyzer'

    def ready(self):
        if 'DB_MODEL_RESET' not in os.environ:
            from django.contrib.auth import get_user_model
            Django_Users = get_user_model().objects.all()
            User_Model = get_user_model().objects
            if len(Django_Users) == 0:
                User_Model.create_user('guest', 'abc', 'guest')
