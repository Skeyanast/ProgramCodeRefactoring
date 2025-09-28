using Moq;
using RPKApp0.Configuration;
using RPKApp0.Core;
using RPKApp0.Infrastructure;
using RPKApp0.Logging;

namespace RPKApp0.Tests.UnitTests.InfrastructureTests;

public class ServerTests
{
    private static Server CreateTestServer()
    {
        Mock<IConfig> configMock = new();
        Mock<Logger> loggerMock = new(null);
        Mock<RequestHandler> requestHandlerMock = new(loggerMock.Object);

        configMock.Setup(c => c["host"]).Returns("localhost");
        configMock.Setup(c => c["port"]).Returns("8080");

        return new Server(configMock.Object, loggerMock.Object);
    }

    [Fact]
    public void Start_ValidConfig_ShouldInitializeListener()
    {
        Server server = CreateTestServer();

        Exception exception = Record.Exception(() =>
        {
            System.Reflection.MethodInfo? method = typeof(Server).GetMethod("InitializeListener",
                System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance);
            method?.Invoke(server, null);
        });

        Assert.Null(exception);

        server.Stop();
    }

    [Fact]
    public void Constructor_ValidDependencies_ShouldInitialize()
    {
        Server server = CreateTestServer();

        Assert.NotNull(server);

        server.Stop();
    }

    [Fact]
    public void Stop_MultipleCalls_ShouldNotThrow()
    {
        Server server = CreateTestServer();

        server.Stop();
        Assert.Throws<ObjectDisposedException>(server.Stop);
    }
}