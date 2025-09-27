using System.Reflection;

namespace RPKApp0.Configuration;

public class ObjectConfig : IConfig
{
    private readonly BindingFlags _flags = BindingFlags.Public | BindingFlags.Instance | BindingFlags.IgnoreCase;

    public object this[string key]
    {
        get
        {
            PropertyInfo? property = GetType().GetProperty(key, _flags);

            if (property != null)
            {
                return property.GetValue(this) ?? "";
            }

            throw new ArgumentException($"Field or property '{key}' not found");
        }
    }

    public required int Port { get; init; }
    public required string Host { get; init; }

    public ObjectConfig() { }

    public IEnumerable<string> GetAllNames()
    {
        IEnumerable<string> properties = GetType().GetProperties(_flags)
            .Select(f => f.Name);

        return properties;
    }

    public Dictionary<string, object> GetAllValues()
    {
        Dictionary<string, object> result = new(StringComparer.OrdinalIgnoreCase);

        foreach (PropertyInfo? property in GetType().GetProperties(_flags))
        {
            result[property.Name] = property.GetValue(this) ?? "";
        }

        return result;
    }
}
