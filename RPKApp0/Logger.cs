namespace RPKApp0
{
    public abstract class Logger
    {
        protected readonly Func<string, string> _formatter;

        public Logger(Func<string, string> formatter = null)
        {
            _formatter = formatter ?? DefaultFormatter;
        }

        abstract public void Log(string message);

        protected static string DefaultFormatter(string message) => $"[LOG] {DateTime.UtcNow:O}: {message}";
    }
}