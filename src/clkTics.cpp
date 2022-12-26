#include <iostream>
#include <unistd.h>

int main() {
  // Use sysconf to get the clock ticks per second value
  long clockTicksPerSecond = sysconf(_SC_CLK_TCK);
  std::cout << clockTicksPerSecond;
  return 0;
}