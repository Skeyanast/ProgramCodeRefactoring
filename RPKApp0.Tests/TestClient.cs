using System.Net;

namespace RPKApp0;

public class TestClient
{
    public static void TestServerConnection(string url)
    {
        try
        {
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
            request.Method = "GET";

            using HttpWebResponse response = (HttpWebResponse)request.GetResponse();
            using Stream stream = response.GetResponseStream();
            using StreamReader reader = new(stream);
            string body = reader.ReadToEnd();
            Console.WriteLine("Test request response body:");
            Console.WriteLine(body);
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Test request failed: {ex.Message}");
        }
    }
}