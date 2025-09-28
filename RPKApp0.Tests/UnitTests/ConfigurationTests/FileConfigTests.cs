using RPKApp0.Configuration;

namespace RPKApp0.Tests.UnitTests.ConfigurationTests;

public class FileConfigTests : IDisposable
{
    private readonly string _tempFilePath;
    private readonly List<string> _tempFiles = [];

    public FileConfigTests()
    {
        _tempFilePath = Path.GetTempFileName();
        _tempFiles.Add(_tempFilePath);
    }

    public void Dispose()
    {
        foreach (string file in _tempFiles)
        {
            if (File.Exists(file))
            {
                File.Delete(file);
            }
        }
    }

    private string CreateTempConfigFile(string content)
    {
        string tempFile = Path.GetTempFileName();
        File.WriteAllText(tempFile, content);
        _tempFiles.Add(tempFile);
        return tempFile;
    }

    [Fact]
    public void Constructor_ValidConfigFile_ShouldLoadData()
    {
        string configJson = """{"port": 8080, "host": "localhost"}""";
        string configFile = CreateTempConfigFile(configJson);

        FileConfig config = new(configFile);

        bool portParsed = int.TryParse(config["Port"].ToString(), out int configPort);
        Assert.True(portParsed);
        Assert.Equal(8080, configPort);
        Assert.Equal("localhost", config["Host"].ToString());
    }

    [Fact]
    public void Constructor_DefaultFilePath_ShouldUseAppSettingsJson()
    {
        string configJson = """{"testkey": "testValue"}""";
        File.WriteAllText("appsettings.json", configJson);
        _tempFiles.Add("appsettings.json");

        FileConfig config = new();

        Assert.Equal("testValue", config["TestKey"].ToString());
    }

    [Fact]
    public void Constructor_FileNotFound_ShouldThrowFileNotFoundException()
    {
        string nonExistentFile = "nonexistent.json";

        FileNotFoundException exception = Assert.Throws<FileNotFoundException>(() => new FileConfig(nonExistentFile));
        Assert.Contains(nonExistentFile, exception.Message);
    }

    [Fact]
    public void Constructor_InvalidJson_ShouldThrowInvalidOperationException()
    {

        string invalidJson = "{ invalid json }";
        string configFile = CreateTempConfigFile(invalidJson);

        InvalidOperationException exception = Assert.Throws<InvalidOperationException>(() => new FileConfig(configFile));
        Assert.Contains("Failed to load configuration", exception.Message);
    }

    [Fact]
    public void Indexer_ExistingKey_ShouldReturnValue()
    {
        string configJson = """{"port": 8080, "host": "localhost"}""";
        string configFile = CreateTempConfigFile(configJson);
        FileConfig config = new(configFile);

        bool portParsed = int.TryParse(config["Port"].ToString(), out int configPort);
        Assert.True(portParsed);
        Assert.Equal(8080, configPort);
        Assert.Equal("localhost", config["Host"].ToString());
    }

    [Fact]
    public void Indexer_NonExistentKey_ShouldThrowKeyNotFoundException()
    {

        string configJson = """{"Port": 8080}""";
        string configFile = CreateTempConfigFile(configJson);
        var config = new FileConfig(configFile);

        var exception = Assert.Throws<KeyNotFoundException>(() => config["NonExistentKey"]);
        Assert.Contains("Configuration key 'NonExistentKey' not found", exception.Message);
    }

    [Theory]
    [InlineData("")]
    [InlineData("  ")]
    [InlineData(null)]
    public void Indexer_InvalidKey_ShouldThrowKeyNotFoundException(string invalidKey)
    {
        string configJson = """{"Port": 8080}""";
        string configFile = CreateTempConfigFile(configJson);
        FileConfig config = new(configFile);

        Assert.Throws<ArgumentException>(() => config[invalidKey]);
    }

    [Theory]
    [InlineData(["port", "host"])]
    [InlineData(["Port", "Host"])]
    [InlineData(["PORT", "HOST"])]
    public void LoadConfig_PropertyCaseInsensitive_ShouldWork(string portKey, string hostKey)
    {
        string configJson = """{"port": 8080, "host": "localhost"}""";
        string configFile = CreateTempConfigFile(configJson);
        FileConfig config = new(configFile);

        bool portParsed = int.TryParse(config[portKey].ToString(), out int configPort);
        Assert.True(portParsed);
        Assert.Equal(8080, configPort);

        Assert.Equal("localhost", config[hostKey].ToString());
    }

    [Fact]
    public void LoadConfig_EmptyJson_ShouldReturnEmptyDictionary()
    {
        string configJson = "{}";
        string configFile = CreateTempConfigFile(configJson);

        FileConfig config = new(configFile);

        Assert.Throws<KeyNotFoundException>(() => config["AnyKey"]);
    }
}