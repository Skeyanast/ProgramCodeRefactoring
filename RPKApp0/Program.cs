using RPKApp0.Configuration;
using RPKApp0.Infrastructure;
using RPKApp0.Logging;
using RPKApp0.Middleware;

namespace RPKApp0;

public static class Program
{
    public static void Main(string[] args)
    {
        //IConfig config = new ObjectConfig() { Host = "localhost", Port = 8080 };
        IConfig config = new FileConfig("jsconfig1.json");

        //Logger logger = new ConsoleLogger(message => $"[log]: {message}");
        Logger logger = new FileLogger("app.log", message => $"[log]: {message}\n");

        Server server = new(config, logger);

        MiddlewareApplier.ApplyMiddleware(server);

        StartServerInBackground(server);
        WaitForUserInput(server);
    }

    private static void StartServerInBackground(Server server)
    {
        Thread serverThread = new(server.Start)
        {
            IsBackground = true
        };
        serverThread.Start();
        Thread.Sleep(500);
    }

    private static void WaitForUserInput(Server server)
    {
        Console.WriteLine("Press 'q' to stop the server...");

        while (Console.ReadKey().Key != ConsoleKey.Q)
        {
            Thread.Sleep(100);
        }

        server.Stop();
        Console.WriteLine("\nServer stopped. Main finished.");
    }
}

