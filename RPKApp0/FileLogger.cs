namespace RPKApp0;

public class FileLogger : Logger
{
    private readonly string _fileName;

    public FileLogger(string fileName, Func<string, string> formatter)
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
}
