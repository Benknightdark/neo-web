using Microsoft.AspNetCore.Razor.TagHelpers;

namespace neo_backend.TagHelpers
{
    /// <summary>
    /// 必須使用此方式引用外部es module，不然typ=importmap的屬性在專案執行或發行後不見 
    /// </summary>
    [HtmlTargetElement("import-map")]
    public class ImportMapTagHelper : TagHelper
    {
        public override void Process(TagHelperContext context, TagHelperOutput output)
        {
            // 將 <import-map> 標籤替換為 <script>
            output.TagName = "script";
            
            // 強制設定 type="importmap"
            output.Attributes.SetAttribute("type", "importmap");
            
            // 確保標籤有開始和結束 (不是 self-closing)
            output.TagMode = TagMode.StartTagAndEndTag;
        }
    }
}
