namespace RPKApp0.Logging;

public class ConsoleLogger : Logger
{
    public ConsoleLogger(Func<string, string> formatter = null)
        : base(formatter)
    { }

    public override void Log(string message)
    {
        Console.WriteLine(_formatter(message));
    }

    protected override string DefaultFormatter(string message) => $"[LOG] {DateTime.UtcNow:O}: {message}";
}