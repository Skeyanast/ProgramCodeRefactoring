namespace RPKApp0.Configuration;

public interface IConfig
{
    object this[string key] { get; }
}
