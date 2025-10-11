namespace PCRApp0.Tests.UnitTests;

public class LevenshteinCalculatorTests
{
    [Fact]
    public void LevenshteinDistance_EmptyStrings_ReturnsZero()
    {
        string s1 = string.Empty;
        string s2 = string.Empty;

        int result = LevenshteinCalculator.LevenshteinDistance(s1, s2);

        Assert.Equal(0, result);
    }

    [Theory]
    [InlineData("", "test")]
    [InlineData("test", "")]
    public void LevenshteinDistance_OneStringEmpty_ReturnsAnotherStringLength(string s1, string s2)
    {
        int expected = s1.Length == 0 ? s2.Length : s1.Length;

        int result = LevenshteinCalculator.LevenshteinDistance(s1, s2);

        Assert.Equal(expected, result);
    }

    [Theory]
    [InlineData("")]
    [InlineData("a")]
    [InlineData("hello")]
    [InlineData("programming")]
    public void LevenshteinDistance_IdenticalStrings_ReturnsZero(string input)
    {
        int result = LevenshteinCalculator.LevenshteinDistance(input, input);

        Assert.Equal(0, result);
    }

    [Theory]
    [InlineData("cat", "cut", 1)]
    [InlineData("haven", "fever", 3)]
    [InlineData("kittens", "sitting", 3)]
    [InlineData("microsoft", "bloomberg", 9)]
    [InlineData("calculator", "applicator", 6)]
    [InlineData("programming", "refactoring", 8)]
    public void LevenshteinDistance_ValidStrings_ShouldReturnCorrect(string s1, string s2, int expected)
    {
        int result = LevenshteinCalculator.LevenshteinDistance(s1, s2);

        Assert.Equal(expected, result);
    }

    [Theory]
    [InlineData("Hello", "hello", 1)]
    [InlineData("ABC", "abc", 3)]
    [InlineData("Case", "CASE", 3)]
    public void LevenshteinDistance_CaseSensitive_ReturnsCorrectDistance(string s1, string s2, int expected)
    {
        int result = LevenshteinCalculator.LevenshteinDistance(s1, s2);

        Assert.Equal(expected, result);
    }

    [Theory]
    [InlineData("café", "cafe", 1)]
    [InlineData("niño", "nino", 1)]
    [InlineData("hello!", "hello", 1)]
    [InlineData("test@mail", "test-mail", 1)]
    public void LevenshteinDistance_SpecialCharacters_ReturnsCorrectDistance(string s1, string s2, int expected)
    {
        int result = LevenshteinCalculator.LevenshteinDistance(s1, s2);

        Assert.Equal(expected, result);
    }

    [Theory]
    [InlineData("hello world", "helloworld", 1)]
    [InlineData("test string", "test  string", 1)]
    [InlineData(" spaced ", "spaced", 2)]
    public void LevenshteinDistance_Spaces_ReturnsCorrectDistance(string s1, string s2, int expected)
    {
        int result = LevenshteinCalculator.LevenshteinDistance(s1, s2);

        Assert.Equal(expected, result);
    }
}
