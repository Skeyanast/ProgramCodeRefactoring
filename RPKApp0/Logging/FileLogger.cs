namespace RPKApp0.Logging;

public class FileLogger : Logger
{
    private readonly string _fileName;

    public FileLogger(string fileName, Func<string, string> formatter = null)
        : base(formatter)
    {
        _fileName = fileName;
    }

    public override void Log(string message)
    {
        try
        {
            File.AppendAllText(_fileName, _formatter(message));
        }
        catch (Exception)
        {
            throw new Exception("Falied to write to log file");
        }
    }

    protected override string DefaultFormatter(string message) => $"[LOG] {DateTime.UtcNow:O}: {message}\n";
}
