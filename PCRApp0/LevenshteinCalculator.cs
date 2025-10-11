namespace PCRApp0;

public static class LevenshteinCalculator
{
    public static int LevenshteinDistance(string s1, string s2)
    {
        if (s1 == s2) return 0;
        if (s1.Length == 0) return s2.Length;
        if (s2.Length == 0) return s1.Length;

        if (s1.Length == s2.Length && s1.Equals(s2)) return 0;

        int[] previousRow = new int[s2.Length + 1];
        int[] currentRow = new int[s2.Length + 1];

        for (int j = 0; j <= s2.Length; j++)
        {
            previousRow[j] = j;
        }

        for (int i = 1; i <= s1.Length; i++)
        {
            currentRow[0] = i;

            for (int j = 1; j <= s2.Length; j++)
            {
                int cost = (s1[i - 1] == s2[j - 1]) ? 0 : 1;
                currentRow[j] = Math.Min(Math.Min(previousRow[j] + 1, currentRow[j - 1] + 1), previousRow[j - 1] + cost);
            }

            (currentRow, previousRow) = (previousRow, currentRow);
        }

        return previousRow[s2.Length];
    }
}
