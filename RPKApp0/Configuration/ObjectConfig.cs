using System.Reflection;

namespace RPKApp0.Configuration;

public class ObjectConfig : IConfig
{
    private readonly BindingFlags _flags = BindingFlags.Public | BindingFlags.Instance | BindingFlags.IgnoreCase;

    public object this[string key]
    {
        get
        {
            if (IsKeyValid(key))
            {
                PropertyInfo? property = GetType().GetProperty(key, _flags);

                if (property != null)
                {
                    return property.GetValue(this) ?? "";
                }

                throw new ArgumentException($"Field or property '{key}' not found");
            }
            throw new ArgumentException($"Invalid key");
        }
    }

    public required int Port { get; init; }
    public required string Host { get; init; }

    public ObjectConfig() { }

    private static bool IsKeyValid(string key)
    {
        return key != null && !string.IsNullOrWhiteSpace(key);
    }
}
