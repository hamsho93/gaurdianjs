import requests
import json
from functools import wraps

class GuardianClient:
    def __init__(self, api_url='http://localhost:3333'):
        self.api_url = api_url
        
    def detect_bot(self, user_agent, ip, path=None):
        """Detect if a request is from a bot"""
        response = requests.post(
            f"{self.api_url}/detect",
            json={
                "userAgent": user_agent,
                "ip": ip,
                "path": path
            }
        )
        return response.json()
    
    # Flask middleware
    def middleware(self):
        """Flask middleware for bot detection"""
        def decorator(f):
            @wraps(f)
            def decorated_function(*args, **kwargs):
                from flask import request, g
                
                result = self.detect_bot(
                    user_agent=request.headers.get('User-Agent', ''),
                    ip=request.remote_addr,
                    path=request.path
                )
                g.bot_detection = result
                return f(*args, **kwargs)
            return decorated_function
        return decorator