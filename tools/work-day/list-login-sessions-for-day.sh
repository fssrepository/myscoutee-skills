#!/usr/bin/env bash

DAY="$1"

if [ -z "$DAY" ]; then
    echo "Usage: ../myscoutee-skills/tools/work-day/list-login-sessions-for-day.sh YYYY-MM-DD"
    exit 1
fi

NEXT_DAY=$(date -d "$DAY +1 day" +%Y-%m-%d)

echo "Sessions for $DAY"
echo

for f in /var/log/wtmp /var/log/wtmp.*; do
    [ -e "$f" ] || continue

    if [[ "$f" == *.gz ]]; then
        TMP=$(mktemp)
        gunzip -c "$f" > "$TMP" 2>/dev/null
        SOURCE="$TMP"
    else
        SOURCE="$f"
    fi

    last -F "$USER" --since "$DAY 00:00:00" --until "$NEXT_DAY 00:00:00" -f "$SOURCE" 2>/dev/null |
    grep -vE 'reboot|shutdown|wtmp begins|still logged in'

    [ -n "$TMP" ] && rm -f "$TMP"
done
