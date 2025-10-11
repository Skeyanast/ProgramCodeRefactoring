using System.Diagnostics;
namespace PCRApp0;

internal class ManualLevenshteinBenchmark
{
    public static void RunBenchmarks(int iterations, int stringRepeatCount)
    {
        Func<string, string> stringFormatter = (str) => string.Concat(Enumerable.Repeat(str, stringRepeatCount));

        Console.WriteLine("=== Levenshtein Distance Manual Benchmark ===\n");
        var testCases = new[]
        {
            new {
                s1 = stringFormatter("cat"),
                s2 = stringFormatter("cut"),
                description = $"Length {3 * stringRepeatCount} strings"
            },
            new {
                s1 = stringFormatter("haven"),
                s2 = stringFormatter("fever"),
                description = $"Length {5 * stringRepeatCount} strings"
            },
            new {
                s1 = stringFormatter("kittens"),
                s2 = stringFormatter("sitting"),
                description = $"Length {7 * stringRepeatCount} strings"
            },
            new {
                s1 = stringFormatter("microsoft"),
                s2 = stringFormatter("bloomberg"),
                description = $"Length {9 * stringRepeatCount} strings"
            },
            new {
                s1 = stringFormatter("calculator"),
                s2 = stringFormatter("applicator"),
                description = $"Length {10 * stringRepeatCount} strings"
            },
            new {
                s1 = stringFormatter("programming"),
                s2 = stringFormatter("refactoring"),
                description = $"Length {11 * stringRepeatCount} strings"
            },
            new {
                s1 = "",
                s2 = stringFormatter("test"),
                description = "Empty first string"
            },
            new {
                s1 = stringFormatter("test"),
                s2 = "",
                description = "Empty second string"
            }
        };

        Stopwatch stopwatch = new();

        foreach (var testCase in testCases)
        {
            Console.WriteLine($"Test: {testCase.description}");
            //Console.WriteLine($"Strings: '{testCase.s1}' vs '{testCase.s2}'");

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
