// вариант 10: поиск расстояния Левенштейна

using System;
using System.Diagnostics;

class Program
{
    static int LevenshteinDistance(string s1, string s2)
    {
        if (s1.Length == 0) return s2.Length;
        if (s2.Length == 0) return s1.Length;

        int cost = s1[0] == s2[0] ? 0 : 1;

        return Math.Min(
            Math.Min(
                LevenshteinDistance(s1.Substring(1), s2) + 1,
                LevenshteinDistance(s1, s2.Substring(1)) + 1),
            LevenshteinDistance(s1.Substring(1), s2.Substring(1)) + cost);
    }

    static void Main()
    {
        string s1 = "kitten";
        string s2 = "sitting";
        Stopwatch sw = Stopwatch.StartNew();
        int distance = LevenshteinDistance(s1, s2);
        sw.Stop();
        Console.WriteLine($"Расстояние Левенштейна: {distance}");
        Console.WriteLine("Время: " + sw.ElapsedMilliseconds + " мс");
    }
}