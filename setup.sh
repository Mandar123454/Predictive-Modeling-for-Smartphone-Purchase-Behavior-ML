#!/bin/bash

# SmartPredict Dashboard Setup Script for Linux/Mac
# ==================================================

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

echo -e "${CYAN}${BOLD}"
echo "==============================================="
echo "        SmartPredict Dashboard Setup"
echo "    Predictive Modeling for Smartphone"
echo "           Purchase Behavior"
echo "==============================================="
echo -e "${NC}"

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check Python installation
echo -e "[1/4] ${BLUE}Checking Python installation...${NC}"
if command_exists python3; then
    PYTHON_CMD="python3"
    python_version=$(python3 --version 2>&1)
    echo -e "✅ ${GREEN}$python_version found${NC}"
elif command_exists python; then
    PYTHON_CMD="python"
    python_version=$(python --version 2>&1)
    echo -e "✅ ${GREEN}$python_version found${NC}"
else
    echo -e "❌ ${RED}Python not found! Please install Python 3.7+ first${NC}"
    echo -e "${YELLOW}Visit: https://python.org${NC}"
    exit 1
fi

# Check pip installation
echo -e "\n[2/4] ${BLUE}Checking pip installation...${NC}"
if $PYTHON_CMD -m pip --version >/dev/null 2>&1; then
    echo -e "✅ ${GREEN}pip is available${NC}"
else
    echo -e "❌ ${RED}pip not found! Please install pip first${NC}"
    exit 1
fi

# Install requirements
echo -e "\n[3/4] ${BLUE}Installing Python dependencies...${NC}"
echo -e "📦 ${YELLOW}This may take a few minutes...${NC}"

if [ -f "requirements.txt" ]; then
    $PYTHON_CMD -m pip install -r requirements.txt
    if [ $? -eq 0 ]; then
        echo -e "✅ ${GREEN}Dependencies installed successfully${NC}"
    else
        echo -e "⚠️  ${YELLOW}Some packages may have failed to install, but continuing...${NC}"
    fi
else
    echo -e "⚠️  ${YELLOW}requirements.txt not found, installing basic packages...${NC}"
    $PYTHON_CMD -m pip install flask flask-cors pandas numpy scikit-learn
fi

# Check project structure
echo -e "\n[4/4] ${BLUE}Verifying project structure...${NC}"

if [ -f "Dashboard/app.py" ]; then
    echo -e "✅ ${GREEN}Dashboard application found${NC}"
else
    echo -e "⚠️  ${YELLOW}Dashboard/app.py not found${NC}"
fi

if [ -d "Data" ]; then
    echo -e "✅ ${GREEN}Data directory found${NC}"
else
    echo -e "⚠️  ${YELLOW}Data directory not found${NC}"
fi

if [ -d "Models" ]; then
    echo -e "✅ ${GREEN}Models directory found${NC}"
else
    echo -e "⚠️  ${YELLOW}Models directory not found${NC}"
fi

# Make run_dashboard.py executable
if [ -f "run_dashboard.py" ]; then
    chmod +x run_dashboard.py
fi

# Setup complete
echo -e "\n${CYAN}${BOLD}==============================================="
echo "           🚀 Setup Complete!"
echo "===============================================${NC}"
echo -e "\nTo start the dashboard, you can use:"
echo -e "  1. ${BOLD}$PYTHON_CMD run_dashboard.py${NC}        (Recommended)"
echo -e "  2. ${BOLD}cd Dashboard && $PYTHON_CMD app.py${NC}   (Direct method)"
echo -e "\nThe dashboard will be available at: ${CYAN}http://localhost:5000${NC}"

# Ask if user wants to start now
echo -e "\n${YELLOW}Do you want to start the dashboard now? (y/n): ${NC}"
read -r start_now

if [[ $start_now == "y" || $start_now == "Y" || $start_now == "yes" || $start_now == "YES" ]]; then
    echo -e "\n${GREEN}Starting dashboard...${NC}"
    $PYTHON_CMD run_dashboard.py
else
    echo -e "\n${GREEN}Setup completed. Run '$PYTHON_CMD run_dashboard.py' when ready!${NC}"
fi