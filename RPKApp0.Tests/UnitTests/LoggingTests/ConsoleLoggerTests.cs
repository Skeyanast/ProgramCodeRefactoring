using RPKApp0.Logging;

namespace RPKApp0.Tests.UnitTests.LoggingTests;

public class ConsoleLoggerTests
{
    private readonly StringWriter _consoleOutput;
    private readonly TextWriter _originalConsoleOut;

    public ConsoleLoggerTests()
    {
        _originalConsoleOut = Console.Out;
        _consoleOutput = new StringWriter();
        Console.SetOut(_consoleOutput);
    }

    public void Dispose()
    {
        Console.SetOut(_originalConsoleOut);
        _consoleOutput.Dispose();
    }

    [Fact]
    public void Constructor_Default_ShouldInitializeWithDefaultFormatter()
    {
        ConsoleLogger logger = new();
        string message = "test";

        logger.Log(message);

        string output = _consoleOutput.ToString();
        Assert.Contains("[LOG]", output);
        Assert.Contains(message, output);
    }

    [Fact]
    public void Log_ValidMessage_ShouldWriteToConsole()
    {
        ConsoleLogger logger = new();
        string message = "Test console message";

        logger.Log(message);

        string output = _consoleOutput.ToString();
        Assert.Contains(message, output);
        Assert.Contains("[LOG]", output);
    }

    [Fact]
    public void Log_WithCustomFormatter_ShouldUseCustomFormat()
    {
        Func<string, string> customFormatter = msg => $"CUSTOM: {msg}";
        ConsoleLogger logger = new(customFormatter);
        string message = "test message";

        logger.Log(message);

        string output = _consoleOutput.ToString();
        Assert.Equal($"CUSTOM: {message}{Environment.NewLine}", output);
    }

    [Theory]
    [InlineData("")]
    [InlineData("  ")]
    [InlineData(null)]
    public void Log_EmptyOrNullMessage_ShouldNotThrow(string message)
    {
        ConsoleLogger logger = new();

        Action action = () => logger.Log(message);
        Exception exception = Record.Exception(action);

        Assert.Null(exception);
    }
}