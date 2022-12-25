# ZAMOS - CLI

## HOW TO USE

```cpp
zamos [command] --opt [val]

Commands:
  zamos ps   show a snap shot for the system
  zamos top  show real-time status for the system

Options:
      --version  Show version number                                   [boolean]
  -s, --sort     set how to sort the output, by cpu usage or mem usage or pid
                 [the default sort is by cpu, the sort is descending by default]
                                 [choices: "cpu", "mem", "pid"] [default: "cpu"]
  -l, --length   set how to sort the output, by cpu usage or mem usage or pid
                 [the default sort is by cpu, the sort is descending by default]
                                                          [number] [default: 20]
  -h             Show help                                             [boolean]

```

## /PROC FILE SYSTEM 

i'll do it no worries