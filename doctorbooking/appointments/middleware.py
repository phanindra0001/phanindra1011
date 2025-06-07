
import time

class APILoggingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        start_time = time.time()
        response = self.get_response(request)
        duration = time.time() - start_time
        
        if request.path.startswith('/api/'):
            print(f"API {request.method} {request.path} - {response.status_code} - {duration:.2f}s")
        
        return response