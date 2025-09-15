#!/usr/bin/env python3
"""
SmartPredict Dashboard Launcher
==============================

This script launches the SmartPredict dashboard with automatic setup and configuration.
It handles dependency checking, model loading, and provides a user-friendly startup experience.

Usage:
    python run_dashboard.py

Author: SmartPredict Team
Date: September 2025
"""

import os
import sys
import subprocess
import platform
import webbrowser
from pathlib import Path
import time

# Color codes for terminal output
class Colors:
    BLUE = '\033[94m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    CYAN = '\033[96m'
    MAGENTA = '\033[95m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'
    END = '\033[0m'

def print_header():
    """Print the application header with branding."""
    header = f"""
{Colors.CYAN}{Colors.BOLD}
╔══════════════════════════════════════════════════════════════╗
║                        SmartPredict                          ║
║           Predictive Modeling for Smartphone                 ║
║                    Purchase Behavior                         ║
║                                                              ║
║                    🚀 Starting Dashboard...                  ║
╚══════════════════════════════════════════════════════════════╝
{Colors.END}
"""
    print(header)

def check_python_version():
    """Check if Python version is compatible."""
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 7):
        print(f"{Colors.RED}❌ Python 3.7+ required. Current version: {version.major}.{version.minor}{Colors.END}")
        return False
    
    print(f"{Colors.GREEN}✅ Python {version.major}.{version.minor}.{version.micro} detected{Colors.END}")
    return True

def check_and_install_requirements():
    """Check and install required packages."""
    requirements_file = Path("requirements.txt")
    
    if not requirements_file.exists():
        print(f"{Colors.YELLOW}⚠️  requirements.txt not found. Installing basic dependencies...{Colors.END}")
        basic_packages = ["flask", "flask-cors", "pandas", "numpy", "scikit-learn"]
        
        for package in basic_packages:
            print(f"📦 Installing {package}...")
            subprocess.run([sys.executable, "-m", "pip", "install", package], 
                         capture_output=True, text=True)
    else:
        print(f"{Colors.BLUE}📦 Installing dependencies from requirements.txt...{Colors.END}")
        try:
            result = subprocess.run([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"], 
                                  capture_output=True, text=True, check=True)
            print(f"{Colors.GREEN}✅ Dependencies installed successfully{Colors.END}")
        except subprocess.CalledProcessError as e:
            print(f"{Colors.YELLOW}⚠️  Some packages may not have installed. Continuing...{Colors.END}")

def check_project_structure():
    """Verify project structure and required files."""
    print(f"{Colors.BLUE}🔍 Checking project structure...{Colors.END}")
    
    required_paths = {
        "Dashboard/app.py": "Flask application",
        "Dashboard/index.html": "Main dashboard page",
        "Data": "Data directory",
        "Models": "Models directory"
    }
    
    missing_files = []
    for path, description in required_paths.items():
        if not Path(path).exists():
            missing_files.append(f"  - {path} ({description})")
            print(f"{Colors.YELLOW}⚠️  Missing: {path}{Colors.END}")
        else:
            print(f"{Colors.GREEN}✅ Found: {path}{Colors.END}")
    
    if missing_files:
        print(f"\n{Colors.YELLOW}Missing files detected, but continuing...{Colors.END}")
    
    return len(missing_files) == 0

def get_dashboard_path():
    """Get the correct path to the dashboard application."""
    dashboard_paths = [
        Path("Dashboard/app.py"),
        Path("app.py"),
        Path("Dashboard/api/app.py")
    ]
    
    for path in dashboard_paths:
        if path.exists():
            return path
    
    return None

def start_dashboard():
    """Start the Flask dashboard application."""
    dashboard_path = get_dashboard_path()
    
    if not dashboard_path:
        print(f"{Colors.RED}❌ Dashboard application not found!{Colors.END}")
        print("Please ensure app.py exists in one of these locations:")
        print("  - Dashboard/app.py")
        print("  - app.py")
        print("  - Dashboard/api/app.py")
        return False
    
    print(f"{Colors.GREEN}🚀 Starting dashboard from: {dashboard_path}{Colors.END}")
    print(f"{Colors.CYAN}📊 Dashboard will be available at: http://localhost:5000{Colors.END}")
    print(f"{Colors.YELLOW}💡 Press Ctrl+C to stop the server{Colors.END}\n")
    
    # Change to the correct directory
    if "Dashboard" in str(dashboard_path):
        os.chdir("Dashboard")
        dashboard_path = Path("app.py")
    
    # Start the Flask application
    try:
        # Give a moment for the message to be read
        time.sleep(2)
        
        # Auto-open browser after a short delay
        import threading
        def open_browser():
            time.sleep(3)  # Wait 3 seconds for the server to start
            webbrowser.open("http://localhost:5000")
        
        browser_thread = threading.Thread(target=open_browser)
        browser_thread.daemon = True
        browser_thread.start()
        
        # Start Flask application
        subprocess.run([sys.executable, str(dashboard_path)], check=True)
        
    except KeyboardInterrupt:
        print(f"\n{Colors.CYAN}👋 Dashboard stopped by user{Colors.END}")
        return True
    except subprocess.CalledProcessError as e:
        print(f"{Colors.RED}❌ Error starting dashboard: {e}{Colors.END}")
        return False
    except Exception as e:
        print(f"{Colors.RED}❌ Unexpected error: {e}{Colors.END}")
        return False

def main():
    """Main function to orchestrate the dashboard startup."""
    try:
        print_header()
        
        # System checks
        print(f"{Colors.BOLD}🔧 System Checks{Colors.END}")
        if not check_python_version():
            return 1
        
        # Install dependencies
        print(f"\n{Colors.BOLD}📦 Dependency Management{Colors.END}")
        check_and_install_requirements()
        
        # Check project structure
        print(f"\n{Colors.BOLD}📁 Project Structure{Colors.END}")
        check_project_structure()
        
        # Start dashboard
        print(f"\n{Colors.BOLD}🚀 Launch Dashboard{Colors.END}")
        success = start_dashboard()
        
        if success:
            print(f"\n{Colors.GREEN}✅ Dashboard session completed successfully{Colors.END}")
            return 0
        else:
            return 1
            
    except Exception as e:
        print(f"\n{Colors.RED}❌ Fatal error: {e}{Colors.END}")
        return 1

if __name__ == "__main__":
    sys.exit(main())