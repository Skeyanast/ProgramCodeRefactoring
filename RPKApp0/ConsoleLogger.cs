namespace RPKApp0;

public class ConsoleLogger : Logger
{
    public ConsoleLogger(Func<string, string> formatter = null)
        : base(formatter)
    { }

    public override void Log(string message)
    {
        Console.WriteLine(_formatter(message));
    }
}