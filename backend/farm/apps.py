from django.apps import AppConfig


class FarmConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'farm'

    def ready(self):
        # Initialize Firebase when the app is ready
        import firebase_admin
        from django.conf import settings
        
        # Check if Firebase app is already initialized
        if not firebase_admin._apps:
            cred = firebase_admin.credentials.Certificate(settings.FIREBASE_CREDENTIALS)
            firebase_admin.initialize_app(cred, {
                'databaseURL': 'https://your-project-id.firebaseio.com'  # Replace with your Firebase URL
            })
