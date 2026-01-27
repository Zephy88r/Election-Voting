#!/usr/bin/env python
"""
Start Django Server
"""

import os
import sys
import subprocess

def start_server():
    """Start Django development server"""
    
    # Change to backend directory
    backend_dir = os.path.join(os.path.dirname(__file__), 'backend')
    os.chdir(backend_dir)
    
    print("Starting Django server...")
    print("Admin panel: http://127.0.0.1:8000/admin/")
    print("API base: http://127.0.0.1:8000/elections/api/")
    print("Press Ctrl+C to stop")
    
    # Run Django server
    subprocess.run([sys.executable, 'manage.py', 'runserver', '127.0.0.1:8000'])

if __name__ == "__main__":
    start_server()