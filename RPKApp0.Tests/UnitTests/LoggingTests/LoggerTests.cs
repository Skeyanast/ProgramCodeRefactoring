using RPKApp0.Logging;
using Moq;

namespace RPKApp0.Tests.UnitTests.LoggingTests;

public class LoggerTests
{
    private class TestableLogger : Logger
    {
        public string LastFormattedMessage { get; private set; }
        public Func<string, string> Formatter => _formatter;

        public TestableLogger(Func<string, string> formatter = null) : base(formatter) { }

        public override void Log(string message)
        {
            LastFormattedMessage = _formatter(message);
        }

        public string DefaultFormatterSubstitute(string message) => DefaultFormatter(message);

        protected override string DefaultFormatter(string message) => $"[LOG] {DateTime.UtcNow:O}: {message}";
    }

    [Fact]
    public void Constructor_NoFormatterProvided_ShouldUseDefaultFormatter()
    {
        TestableLogger logger = new();

        Assert.NotNull(logger.Formatter);
    }

    [Fact]
    public void Constructor_CustomFormatterProvided_ShouldUseCustomFormatter()
    {
        Func<string, string> customFormatter = msg => $"CUSTOM: {msg}";

        TestableLogger logger = new(customFormatter);

        Assert.Equal(customFormatter, logger.Formatter);
    }

    [Fact]
    public void DefaultFormatter_ValidMessage_ShouldFormatCorrectly()
    {
        string message = "Test message";

        TestableLogger logger = new();

        string formatted = logger.DefaultFormatterSubstitute(message);

        Assert.StartsWith("[LOG]", formatted);
        Assert.Contains(message, formatted);
        Assert.Contains(DateTime.UtcNow.Year.ToString(), formatted);
    }

    [Theory]
    [InlineData("")]
    [InlineData(null)]
    public void DefaultFormatter_MessageEdgeCases_ShouldFormatCorrectly(string message)
    {
        TestableLogger logger = new();

        string formatted = logger.DefaultFormatterSubstitute(message);
        
        Assert.StartsWith("[LOG]", formatted);
        Assert.Contains(":", formatted);
    }
}
