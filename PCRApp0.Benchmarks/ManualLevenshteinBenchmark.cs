using System.Diagnostics;
namespace PCRApp0;

internal class ManualLevenshteinBenchmark
{
    public static void RunBenchmarks(int iterations)
    {
        Console.WriteLine("=== Levenshtein Distance Manual Benchmark ===\n");

        var testCases = new[]
        {
            new { s1 = "cat", s2 = "cut", description = "Short strings" },
            new { s1 = "kitten", s2 = "sitting", description = "Medium strings" },
            new { s1 = "programming", s2 = "refactoring", description = "Long strings" },
            new { s1 = "", s2 = "test", description = "Empty first string" },
            new { s1 = "test", s2 = "", description = "Empty second string" }
        };

        Stopwatch stopwatch = new();

        foreach (var testCase in testCases)
        {
            Console.WriteLine($"Test: {testCase.description}");
            Console.WriteLine($"Strings: '{testCase.s1}' vs '{testCase.s2}'");

            // pre calculate run 
            LevenshteinCalculator.LevenshteinDistance(testCase.s1, testCase.s2);

            stopwatch.Restart();
            for (int i = 0; i < iterations; i++)
            {
                LevenshteinCalculator.LevenshteinDistance(testCase.s1, testCase.s2);
            }
            stopwatch.Stop();

            int result = LevenshteinCalculator.LevenshteinDistance(testCase.s1, testCase.s2);
            long totalTime = stopwatch.ElapsedTicks;
            double averageTime = (double)totalTime / iterations;

            Console.WriteLine($"Result: {result}");
            Console.WriteLine($"Total time: {totalTime} ticks");
            Console.WriteLine($"Average time: {averageTime:F2} ticks");
            Console.WriteLine($"Average time: {stopwatch.ElapsedMilliseconds / (double)iterations:F4} ms");
            Console.WriteLine("---");
        }
    }
}
