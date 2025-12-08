#!/bin/bash
# Security Check Script
# Run this locally before commits or use in pre-commit hooks
# Usage: ./scripts/security-check.sh

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🔒 Running Security Checks..."
echo "================================"

# Check if pnpm is available
if ! command -v pnpm &> /dev/null; then
    echo -e "${RED}Error: pnpm is not installed${NC}"
    exit 1
fi

# Run pnpm audit
echo ""
echo "📦 Checking dependencies for known vulnerabilities..."
echo "------------------------------------------------------"

AUDIT_OUTPUT=$(pnpm audit 2>&1) || true

echo "$AUDIT_OUTPUT"
echo ""

# Check for critical/high vulnerabilities by parsing pnpm audit output
CRITICAL_COUNT=$(echo "$AUDIT_OUTPUT" | grep -c "│ critical" 2>/dev/null || echo "0")
HIGH_COUNT=$(echo "$AUDIT_OUTPUT" | grep -c "│ high" 2>/dev/null || echo "0")

# Ensure we have valid integers
CRITICAL_COUNT=${CRITICAL_COUNT:-0}
HIGH_COUNT=${HIGH_COUNT:-0}

# Check for critical vulnerabilities
if [ "$CRITICAL_COUNT" -gt 0 ] 2>/dev/null; then
    echo -e "${RED}❌ CRITICAL: $CRITICAL_COUNT critical vulnerability(ies) found!${NC}"
    echo -e "${RED}   Action required: Run 'pnpm audit fix' or manually update packages${NC}"
    exit 1
fi

if [ "$HIGH_COUNT" -gt 0 ] 2>/dev/null; then
    echo -e "${YELLOW}⚠️  WARNING: $HIGH_COUNT high severity vulnerability(ies) found${NC}"
    echo -e "${YELLOW}   Recommended: Review and update affected packages${NC}"
fi

# Check specific critical packages versions
echo ""
echo "🔍 Checking critical package versions..."
echo "-----------------------------------------"

# Get Next.js version
NEXT_VERSION=$(node -p "require('./package.json').dependencies.next" 2>/dev/null || echo "not found")
echo "Next.js version: $NEXT_VERSION"

# Check for known vulnerable Next.js versions
# Multiple CVEs affect Next.js 15.x:
# - CVE-2025-55182 (React2Shell): < 15.1.9
# - GHSA-f82v-jwr5-mffw (Auth Bypass): < 15.2.3
# - GHSA-4342-x723-ch2f (SSRF): < 15.4.7
# Minimum safe version: 15.5.7 or 16.0.7+
NEXT_CLEAN_VERSION=$(echo "$NEXT_VERSION" | tr -d '^~')
echo "Checking Next.js $NEXT_CLEAN_VERSION for known vulnerabilities..."

# Extract major.minor.patch
if [[ "$NEXT_CLEAN_VERSION" =~ ^([0-9]+)\.([0-9]+)\.([0-9]+) ]]; then
    MAJOR="${BASH_REMATCH[1]}"
    MINOR="${BASH_REMATCH[2]}"
    PATCH="${BASH_REMATCH[3]}"
    
    # Check if version is vulnerable (15.x < 15.5.7)
    if [ "$MAJOR" -eq 15 ]; then
        if [ "$MINOR" -lt 5 ] || ([ "$MINOR" -eq 5 ] && [ "$PATCH" -lt 7 ]); then
            echo -e "${RED}❌ VULNERABLE: Next.js $NEXT_CLEAN_VERSION has known security vulnerabilities${NC}"
            echo -e "${RED}   Multiple CVEs affect this version:${NC}"
            echo -e "${RED}   - CVE-2025-55182 (React2Shell RCE)${NC}"
            echo -e "${RED}   - GHSA-f82v-jwr5-mffw (Auth Bypass - Critical)${NC}"
            echo -e "${RED}   - GHSA-4342-x723-ch2f (SSRF)${NC}"
            echo -e "${RED}   Update to at least 15.5.7 or 16.0.7${NC}"
            exit 1
        fi
    fi
fi

# Get React version
REACT_VERSION=$(node -p "require('./package.json').dependencies.react" 2>/dev/null || echo "not found")
echo "React version: $REACT_VERSION"

# Check for outdated packages
echo ""
echo "📊 Checking for outdated packages..."
echo "------------------------------------"
pnpm outdated 2>&1 || true

echo ""
echo -e "${GREEN}✅ Security check completed${NC}"
echo ""
echo "Tips:"
echo "  - Run 'pnpm audit fix' to automatically fix compatible vulnerabilities"
echo "  - Run 'pnpm update <package>' to update specific packages"
echo "  - Check https://github.com/advisories for security advisories"

