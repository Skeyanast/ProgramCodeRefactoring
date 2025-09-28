using Moq;
using RPKApp0.Core;
using RPKApp0.Logging;

namespace RPKApp0.Tests.UnitTests.CoreTests;

public class SimpleRequestHandlerTests
{
    private readonly Mock<Logger> _logger;
    private readonly RequestHandler _handler;

    public SimpleRequestHandlerTests()
    {
        _logger = new Mock<Logger>(null);
        _handler = new RequestHandler(_logger.Object);
    }

    [Fact]
    public void Constructor_WithLogger_ShouldInitialize()
    {
        RequestHandler handler = new RequestHandler(_logger.Object);

        Assert.NotNull(handler);
    }

    [Fact]
    public void HandleRequest_NullContext_ShouldThrowException()
    {
        Assert.Throws<NullReferenceException>(() => _handler.HandleRequest(null));
    }
}