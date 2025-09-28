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
            if (!IsKeyValid(key))
            {
                throw new ArgumentException($"Invalid key");
            }

            string formattedKey = KeyFormat(key);

            if (_configData.TryGetValue(formattedKey, out var value))
            {
                return value;
            }

            throw new KeyNotFoundException($"Configuration key '{key}' not found");
        }
    }

    public FileConfig(string configFilePath = "appsettings.json")
    {
        _configFilePath = configFilePath;
        _configData = LoadConfig();
    }

    private Dictionary<string, object> LoadConfig()
    {
        if (!File.Exists(_configFilePath))
        {
            throw new FileNotFoundException($"Configuration file not found: {_configFilePath}");
        }

        try
        {
            string json = File.ReadAllText(_configFilePath);
            JsonSerializerOptions options = new()
            {
                PropertyNameCaseInsensitive = true,
                ReadCommentHandling = JsonCommentHandling.Skip
            };

            return JsonSerializer.Deserialize<Dictionary<string, object>>(json, options) ?? [];
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException($"Failed to load configuration: {ex.Message}", ex);
        }
    }

    private static bool IsKeyValid(string key)
    {
        return key != null && !string.IsNullOrWhiteSpace(key);
    }

    private static string KeyFormat(string key)
    {
        return key.ToLower();
    }
}