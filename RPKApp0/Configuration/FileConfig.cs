using System.Text.Json;

namespace RPKApp0.Configuration;

public class FileConfig : IConfig
{
    private readonly Dictionary<string, object> _configData;
    private readonly string _configFilePath;

    public object this[string key]
    {
        get
        {
            if (_configData.TryGetValue(key, out var value))
                return value;

            throw new KeyNotFoundException($"Configuration key '{key}' not found");
        }
    }

    public FileConfig(string configFilePath = "appsettings.json")
    {
        _configFilePath = configFilePath;
        _configData = LoadConfig();
    }

    public T GetValue<T>(string key, T defaultValue = default)
    {
        if (_configData.TryGetValue(key, out var value))
        {
            try
            {
                return (T)Convert.ChangeType(value, typeof(T));
            }
            catch
            {
                return defaultValue;
            }
        }
        return defaultValue;
    }

    public void Reload()
    {
        _configData.Clear();
        var newData = LoadConfig();
        foreach (var item in newData)
        {
            _configData[item.Key] = item.Value;
        }
    }

    private Dictionary<string, object> LoadConfig()
    {
        if (!File.Exists(_configFilePath))
        {
            throw new FileNotFoundException($"Configuration file not found: {_configFilePath}");
        }

        try
        {
            var json = File.ReadAllText(_configFilePath);
            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
                ReadCommentHandling = JsonCommentHandling.Skip
            };

            return JsonSerializer.Deserialize<Dictionary<string, object>>(json, options)
                ?? new Dictionary<string, object>();
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException($"Failed to load configuration: {ex.Message}", ex);
        }
    }
}