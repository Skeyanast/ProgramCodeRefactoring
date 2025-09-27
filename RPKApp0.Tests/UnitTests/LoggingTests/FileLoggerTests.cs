using RPKApp0.Logging;

namespace RPKApp0.Tests.UnitTests.LoggingTests;

public class FileLoggerTests : IDisposable
{
    private readonly string _testFilePath;

    public FileLoggerTests()
    {
        _testFilePath = Path.GetTempFileName();
    }

    public void Dispose()
    {
        if (File.Exists(_testFilePath))
        {
            File.Delete(_testFilePath);
        }
    }

    [Fact]
    public void Constructor_WithFileName_ShouldSetFileName()
    {
        FileLogger logger = new(_testFilePath, null);
        string message = "test";

        logger.Log(message);

        Assert.True(File.Exists(_testFilePath));
        string content = File.ReadAllText(_testFilePath);
        Assert.Contains(message, content);
    }

    [Fact]
    public void Log_ValidMessage_ShouldWriteToFile()
    {
        FileLogger logger = new(_testFilePath);
        string message = "Test file message";

        logger.Log(message);

        string fileContent = File.ReadAllText(_testFilePath);
        Assert.Contains(message, fileContent);
        Assert.Contains("[LOG]", fileContent);
    }

    [Fact]
    public void Log_MultipleMessages_ShouldAppendToFile()
    {
        FileLogger logger = new(_testFilePath);
        List<string> messages = [ "Message 1", "Message 2", "Message 3" ];

        foreach (string message in messages)
        {
            logger.Log(message);
        }

        string fileContent = File.ReadAllText(_testFilePath);
        foreach (string message in messages)
        {
            Assert.Contains(message, fileContent);
        }

        string[] fileContent2 = File.ReadAllLines(_testFilePath);
        Assert.Equal(messages.Count, fileContent2.Length);
    }

    [Fact]
    public void Log_WithCustomFormatter_ShouldUseCustomFormat()
    {
        Func<string, string> customFormatter = msg => $"FILE: {msg}{Environment.NewLine}";
        FileLogger logger = new(_testFilePath, customFormatter);
        string message = "test message";

        logger.Log(message);

        string fileContent = File.ReadAllText(_testFilePath);
        Assert.Equal($"FILE: {message}{Environment.NewLine}", fileContent);
    }

    [Fact]
    public void Log_InvalidFilePath_ShouldThrowException()
    {
        string invalidPath = "//invalid//path//file.log";
        FileLogger logger = new(invalidPath);
        string message = "test message";

        Exception exception = Assert.Throws<Exception>(() => logger.Log(message));

        Assert.Equal("Falied to write to log file", exception.Message);
    }

    [Fact]
    public void Log_ReadOnlyFile_ShouldThrowException()
    {
        File.SetAttributes(_testFilePath, FileAttributes.ReadOnly);
        FileLogger logger = new(_testFilePath);
        string message = "test message";

        try
        {
            Exception exception = Assert.Throws<Exception>(() => logger.Log(message));

            Assert.Equal("Falied to write to log file", exception.Message);
        }
        finally
        {
            File.SetAttributes(_testFilePath, FileAttributes.Normal);
        }
    }

    [Theory]
    [InlineData("")]
    [InlineData("  ")]
    [InlineData(null)]
    public void Log_EmptyOrNullMessage_ShouldNotThrow(string message)
    {
        FileLogger logger = new(_testFilePath);

        try
        {
            logger.Log(message);

            Assert.True(true);
        }
        catch
        {
            Assert.Fail("Log should not throw exception for empty or null messages");
        }
    }
}