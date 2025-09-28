using RPKApp0.Configuration;

namespace RPKApp0.Tests.UnitTests.ConfigurationTests;

public class ObjectConfigTests
{
    [Fact]
    public void Indexer_ValidProperty_ShouldReturnValue()
    {
        ObjectConfig config = new() { Port = 8080, Host = "localhost" };
        

        object portValue = config["Port"];
        object hostValue = config["Host"];


        Assert.Equal(8080, portValue);
        Assert.Equal("localhost", hostValue);
    }

    [Fact]
    public void Indexer_PropertyCaseInsensitive_ShouldReturnValue()
    {
        ObjectConfig config = new() { Port = 8080, Host = "localhost" };


        object portLower = config["port"];
        object portUpper = config["PORT"];
        object hostMixed = config["HoSt"];


        Assert.Equal(8080, portLower);
        Assert.Equal(8080, portUpper);
        Assert.Equal("localhost", hostMixed);
    }

    [Fact]
    public void Indexer_NonExistentProperty_ShouldThrowArgumentException()
    {
        ObjectConfig config = new() { Port = 8080, Host = "localhost" };
        string propertyName = "NonExistentProperty";


        Exception exception = Assert.Throws<ArgumentException>(() => config[propertyName]);
        Assert.Contains($"Field or property '{propertyName}' not found", exception.Message);
    }

    [Theory]
    [InlineData("")]
    [InlineData("  ")]
    [InlineData(null)]
    public void Indexer_InvalidPropertyName_ShouldThrowArgumentException(string invalidName)
    {
        ObjectConfig config = new() { Port = 8080, Host = "localhost" };


        Exception exception = Assert.Throws<ArgumentException>(() => config[invalidName]);
        Assert.Contains($"Invalid key", exception.Message);
    }
}