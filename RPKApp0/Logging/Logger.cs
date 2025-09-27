namespace RPKApp0.Logging;

public abstract class Logger
{
    protected readonly Func<string, string> _formatter;

    public Logger(Func<string, string> formatter = null)
    {
        _formatter = formatter ?? DefaultFormatter;
    }

    abstract public void Log(string message);

    protected abstract string DefaultFormatter(string message);
}