using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Razor.TagHelpers;
using System.Linq;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Threading.Tasks;

namespace neo_backend.TagHelpers
{
    /// <summary>
    /// 必須使用此方式引用外部es module，不然typ=importmap的屬性在專案執行或發行後不見 
    /// 自動為本地路徑 (以 / 開頭) 加上版本號 (?v=...)
    /// </summary>
    [HtmlTargetElement("import-map")]
    public class ImportMapTagHelper : TagHelper
    {
        private readonly IFileVersionProvider _fileVersionProvider;

        public ImportMapTagHelper(IFileVersionProvider fileVersionProvider)
        {
            _fileVersionProvider = fileVersionProvider;
        }

        public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
        {
            // 將 <import-map> 標籤替換為 <script>
            output.TagName = "script";

            // 強制設定 type="importmap"
            output.Attributes.SetAttribute("type", "importmap");

            // 確保標籤有開始和結束 (不是 self-closing)
            output.TagMode = TagMode.StartTagAndEndTag;

            var childContent = await output.GetChildContentAsync();
            var content = childContent.GetContent();

            if (string.IsNullOrWhiteSpace(content))
            {
                return;
            }

            try
            {
                var jsonNode = JsonNode.Parse(content);
                if (jsonNode != null)
                {
                    bool modified = false;

                    // 處理 "imports"
                    if (jsonNode["imports"] is JsonObject imports)
                    {
                        if (ProcessMap(imports))
                        {
                            modified = true;
                        }
                    }

                    // 處理 "scopes"
                    if (jsonNode["scopes"] is JsonObject scopes)
                    {
                        foreach (var scope in scopes)
                        {
                            if (scope.Value is JsonObject scopeMap)
                            {
                                if (ProcessMap(scopeMap))
                                {
                                    modified = true;
                                }
                            }
                        }
                    }

                    if (modified)
                    {
                        // 重新序列化並設定內容
                        output.Content.SetHtmlContent(jsonNode.ToJsonString(new JsonSerializerOptions { WriteIndented = true }));
                    }
                }
            }
            catch
            {
                // JSON 解析失敗，忽略錯誤，保持原樣
            }
        }

        private bool ProcessMap(JsonObject map)
        {
            bool modified = false;
            // 轉換為 List 以便在迭代時修改 Dictionary
            foreach (var kvp in map.ToList())
            {
                // Import Map 的值應該是字串
                if (kvp.Value is JsonValue val && val.TryGetValue<string>(out var path))
                {
                    if (!string.IsNullOrEmpty(path) && path.StartsWith("/"))
                    {
                        // 加上版本號
                        // AddFileVersionToPath 需要 PathString
                        var versionedPath = _fileVersionProvider.AddFileVersionToPath(path, path);

                        if (versionedPath != path)
                        {
                            map[kvp.Key] = versionedPath;
                            modified = true;
                        }
                    }
                }
            }
            return modified;
        }
    }
}
