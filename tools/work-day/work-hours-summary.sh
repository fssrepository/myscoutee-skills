#!/usr/bin/env bash

# Summarize local login sessions, including days with no recorded sessions.
START=$(date -d "$(date +%Y-%m-01) -3 months" +%Y-%m-01)
END=$(date -d "tomorrow" +%Y-%m-%d)

TMP=$(mktemp)
UNZIPPED=$(mktemp)

for f in /var/log/wtmp /var/log/wtmp.*; do
    [ -e "$f" ] || continue

    case "$f" in
        *.gz)
            gunzip -c "$f" > "$UNZIPPED" 2>/dev/null
            last -F "$USER" --since "$START" --until "$END" -f "$UNZIPPED" >> "$TMP" 2>/dev/null
            ;;
        *)
            last -F "$USER" --since "$START" --until "$END" -f "$f" >> "$TMP" 2>/dev/null
            ;;
    esac
done

sort -u "$TMP" -o "$TMP"

awk -v start="$START" -v end="$END" '
/still logged in|gone - no logout|wtmp begins|reboot|shutdown/ { next }

match($0, /\(([0-9]+\+)?[0-9]+:[0-9]+\)$/) {
    duration = substr($0, RSTART + 1, RLENGTH - 2)

    days = 0
    timepart = duration

    if (duration ~ /\+/) {
        split(duration, dparts, "+")
        days = dparts[1]
        timepart = dparts[2]
    }

    split(timepart, parts, ":")

    mins = (days * 24 * 60) + (parts[1] * 60) + parts[2]

    login = $4 " " $5 " " $6 " " $7 " " $8

    cmd = "date -d \"" login "\" +%F"
    cmd | getline date
    close(cmd)

    login_ts_cmd = "date -d \"" login "\" +%s"
    login_ts_cmd | getline login_ts
    close(login_ts_cmd)

    remaining = mins * 60
    current_ts = login_ts

    while (remaining > 0) {
        cmd = "date -d @" current_ts " +%F"
        cmd | getline current_date
        close(cmd)

        cmd = "date -d \"" current_date " 23:59:59\" +%s"
        cmd | getline end_of_day
        close(cmd)

        seconds_today = end_of_day - current_ts + 1

        if (seconds_today > remaining)
            seconds_today = remaining

        daily[current_date] += int(seconds_today / 60)

        remaining -= seconds_today
        current_ts += seconds_today
    }
}

END {
    printf "%-12s %-10s %-10s %-8s\n", "DATE", "DAY", "TYPE", "HOURS"
    printf "%-12s %-10s %-10s %-8s\n", "------------", "----------", "----------", "--------"

    cmd = "date -d \"" start "\" +%s"
    cmd | getline start_ts
    close(cmd)

    cmd = "date -d \"" end " -1 day\" +%s"
    cmd | getline end_ts
    close(cmd)

    week_total = 0
    month_total = 0
    grand_total = 0
    current_month = ""

    for (ts = start_ts; ts <= end_ts; ts += 86400) {
        cmd = "date -d @" ts " +%F"
        cmd | getline date
        close(cmd)

        cmd = "date -d @" ts " +%A"
        cmd | getline weekday
        close(cmd)

        cmd = "date -d @" ts " +%u"
        cmd | getline daynum
        close(cmd)

        cmd = "date -d @" ts " +%Y-%m"
        cmd | getline month
        close(cmd)

        if (current_month == "")
            current_month = month

        if (month != current_month) {
            printf "%-12s %-10s %-10s %-8.2f\n", current_month, "", "MONTHLY", month_total / 60
            printf "\n"
            month_total = 0
            current_month = month
        }

        mins = daily[date] + 0
        hours = mins / 60

        printf "%-12s %-10s %-10s %-8.2f\n", date, weekday, "daily", hours

        week_total += mins
        month_total += mins
        grand_total += mins

        if (daynum == 7) {
            week_start_cmd = "date -d \"" date " -6 days\" +%F"
            week_start_cmd | getline week_start
            close(week_start_cmd)

            printf "%-12s %-10s %-10s %-8.2f\n", week_start " →", date, "WEEKLY", week_total / 60
            printf "\n"

            week_total = 0
        }
    }

    if (week_total > 0) {
        printf "%-12s %-10s %-10s %-8.2f\n", "partial", "week", "WEEKLY", week_total / 60
    }

    if (month_total > 0) {
        printf "%-12s %-10s %-10s %-8.2f\n", current_month, "", "MONTHLY", month_total / 60
    }

    printf "\n"
    printf "%-12s %-10s %-10s %-8.2f\n", "TOTAL", "", "4-MONTH", grand_total / 60
}
' "$TMP"

rm -f "$TMP" "$UNZIPPED"
